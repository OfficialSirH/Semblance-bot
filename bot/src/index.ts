import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();
await import('#constants/index');

import { publicKey } from '#constants/index';
import fastify from 'fastify';
import { InteractionType, InteractionResponseType, type APIInteraction } from 'discord-api-types/v9';
import type { CustomIdData } from '#lib/interfaces/Semblance';
import nacl from 'tweetnacl';
import { Client } from '#structures/Client';
import {
  ApplicationCommandType,
  type APIChatInputApplicationCommandInteraction,
  type APIContextMenuInteraction,
  MessageFlags,
} from '@discordjs/core';

const client = new Client();

if (Boolean(process.env.DEPLOY) === true) {
  await client.loadCommands();
  await client.deployCommands();
  process.exit(0);
}

await client.login();

const app = fastify();

app.route<{ Body: APIInteraction }>({
  url: process.env.NODE_ENV === 'development' ? '/dev-interactions' : '/interactions',
  method: 'POST',
  preHandler: async (req, res) => {
    const signature = String(req.headers['x-signature-ed25519']);
    const timestamp = String(req.headers['x-signature-timestamp']);
    const body = JSON.stringify(req.body);

    const isValid = nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, 'hex'),
      Buffer.from(publicKey, 'hex'),
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
              ?.preRun?.(rep, interaction as APIChatInputApplicationCommandInteraction);
            break;

          case ApplicationCommandType.User:
          case ApplicationCommandType.Message:
            await client.cache.handles.commands
              .get(interaction?.data.name)
              ?.preRun?.(rep, interaction as APIContextMenuInteraction);
        }
        break;

      case InteractionType.MessageComponent: {
        const parsedCustomId: CustomIdData = JSON.parse(interaction?.data.custom_id);
        const preParseStep = await client.cache.handles.commands
          .get(parsedCustomId.command)
          ?.componentPreparser?.(interaction);

        if (!preParseStep) return rep.status(400).send('Invalid interaction');
        if (preParseStep.ok) {
          await client.cache.handles.commands
            .get(parsedCustomId.command)
            ?.componentRun?.(rep, interaction, preParseStep.value);
        } else {
          await client.api.interactions.reply(rep, {
            content: preParseStep.message,
            flags: MessageFlags.Ephemeral,
          });
        }
        break;
      }

      case InteractionType.ApplicationCommandAutocomplete: {
        await client.cache.handles.commands.get(interaction?.data.name)?.preRun?.(rep, interaction);
        break;
      }

      case InteractionType.ModalSubmit: {
        const parsedCustomId: CustomIdData = JSON.parse(interaction?.data.custom_id);
        client.cache.handles.commands.get(parsedCustomId.command)?.modalRun?.(rep, interaction);
        break;
      }

      default:
        return rep.status(400).send('Unknown interaction type');
    }
  },
});

await app.listen({ port: 8008, host: '0.0.0.0' });
