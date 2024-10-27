import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();
await import('#constants/index');

import { isProduction, publicKey } from '#constants/index';
import type { CustomIdData } from '#lib/interfaces/Semblance';
import { Client } from '#structures/Client';
import { startEventScheduler } from '#structures/eventScheduler';
import {
  ApplicationCommandType,
  MessageFlags,
  type APIChatInputApplicationCommandInteraction,
  type APIContextMenuInteraction,
} from '@discordjs/core';
import { InteractionResponseType, InteractionType, type APIInteraction } from 'discord-api-types/v9';
import fastify from 'fastify';
import nacl from 'tweetnacl';

const client = new Client();

if (Boolean(process.env.DEPLOY) === true) {
  await client.loadCommands();
  await client.deployCommands();
  process.exit(0);
}

await client.login();

startEventScheduler(client);

const app = fastify();

app.route<{ Body: APIInteraction }>({
  url: isProduction ? '/interactions' : '/dev-interactions',
  method: 'POST',
  preHandler: async (req, res) => {
    const signature = String(req.headers['x-signature-ed25519']);
    const timestamp = String(req.headers['x-signature-timestamp']);
    const body = JSON.stringify(req.body);

    const isValid = nacl.sign.detached.verify(
      Uint8Array.from(Buffer.from(timestamp + body)),
      Uint8Array.from(Buffer.from(signature, 'hex')),
      Uint8Array.from(Buffer.from(publicKey, 'hex')),
    );

    if (!isValid) return res.status(401).send('Invalid request signature');
  },
  handler: async (req, rep) => {
    const interaction = req.body;

    if (interaction.type === InteractionType.Ping) return rep.send({ type: InteractionResponseType.Pong });

    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        switch (interaction.data.type) {
          case ApplicationCommandType.ChatInput:
            await client.cache.handles.commands
              .get(interaction?.data.name)
              ?.preRun?.(rep, interaction as APIChatInputApplicationCommandInteraction)
              .catch(e => {
                client.logger.error(`command '${interaction.data.name}' errored: ${e}`);
                client.api.interactions.reply(rep, { content: e, flags: MessageFlags.Ephemeral });
              });
            break;

          case ApplicationCommandType.User:
          case ApplicationCommandType.Message:
            await client.cache.handles.commands
              .get(interaction?.data.name)
              ?.preRun?.(rep, interaction as APIContextMenuInteraction)
              .catch(e => {
                client.logger.error(`command '${interaction.data.name}' errored: ${e}`);
                client.api.interactions.reply(rep, { content: e, flags: MessageFlags.Ephemeral });
              });
        }
        break;

      case InteractionType.MessageComponent: {
        const parsedCustomId: CustomIdData = JSON.parse(interaction?.data.custom_id);
        const preParseStep = await client.cache.handles.commands
          .get(parsedCustomId.command)
          ?.componentPreparser?.(interaction)
          .catch(e => {
            client.logger.error(
              `component with custom id of '${interaction.data.custom_id}' errored at pre-parsing: ${e}`,
            );
            client.api.interactions.reply(rep, { content: e, flags: MessageFlags.Ephemeral });
          });

        if (!preParseStep) return rep.status(400).send('Invalid interaction');
        if (preParseStep.ok) {
          await (
            client.cache.handles.commands
              .get(parsedCustomId.command)
              ?.componentRun?.(rep, interaction, preParseStep.value) as Promise<unknown>
          ).catch(e => {
            client.logger.error(`component with custom id of '${interaction.data.custom_id}' errored: ${e}`);
            client.api.interactions.reply(rep, { content: e, flags: MessageFlags.Ephemeral });
          });
        } else {
          await client.api.interactions.reply(rep, {
            content: preParseStep.message,
            flags: MessageFlags.Ephemeral,
          });
        }
        break;
      }

      case InteractionType.ApplicationCommandAutocomplete: {
        await client.cache.handles.commands
          .get(interaction?.data.name)
          ?.preRun?.(rep, interaction)
          .catch(e => {
            client.logger.error(`autocomplete for command '${interaction.data.name}' errored: ${e}`);
            client.api.interactions.reply(rep, { content: e, flags: MessageFlags.Ephemeral });
          });
        break;
      }

      case InteractionType.ModalSubmit: {
        const parsedCustomId: CustomIdData = JSON.parse(interaction?.data.custom_id);
        await (
          client.cache.handles.commands.get(parsedCustomId.command)?.modalRun?.(rep, interaction) as Promise<void>
        ).catch(e => {
          client.logger.error(`modal submission with custom id of '${interaction.data.custom_id}' errored: ${e}`);
          client.api.interactions.reply(rep, { content: e, flags: MessageFlags.Ephemeral });
        });
        break;
      }

      default:
        return rep.status(400).send('Unknown interaction type');
    }
  },
});

await app.listen({ port: process.env.PORT || 8008, host: '0.0.0.0' });
