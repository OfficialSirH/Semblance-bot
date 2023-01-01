import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();
await import('#constants/index');

import { publicKey, UserId } from '#constants/index';
import fastify from 'fastify';
import { InteractionType, InteractionResponseType, type APIInteraction } from 'discord-api-types/v9';
import type { CustomIdData } from '#lib/interfaces/Semblance';
import nacl from 'tweetnacl';
import { Client } from '#structures/Client';
import {
  ApplicationCommandType,
  type APIChatInputApplicationCommandInteraction,
  type APIContextMenuInteraction,
  type APIMessageComponentInteraction,
  type APIApplicationCommandAutocompleteInteraction,
  type APIModalSubmitInteraction,
} from '@discordjs/core';

const client = new Client();

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

    // TODO: remove this whenever I finish setting up proper permission checks
    if (interaction.member?.user?.id === UserId.sirh) client.logger.info('Sirh test', interaction);
    else return rep.status(400).send('not sirh');

    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        switch (interaction.data.type) {
          case ApplicationCommandType.ChatInput:
            await client.cache.commands
              .get(interaction?.data.name)
              ?.chatInputRun?.(rep, interaction as APIChatInputApplicationCommandInteraction);
            break;

          case ApplicationCommandType.User:
          case ApplicationCommandType.Message:
            await client.cache.commands
              .get(interaction?.data.name)
              ?.contextMenuRun?.(rep, interaction as APIContextMenuInteraction);
        }
        break;

      case InteractionType.MessageComponent: {
        const parsedCustomId: CustomIdData = JSON.parse(interaction?.data.custom_id);
        await client.cache.commands
          .get(parsedCustomId.command)
          ?.componentRun?.(rep, interaction as APIMessageComponentInteraction, parsedCustomId);
        break;
      }

      case InteractionType.ApplicationCommandAutocomplete: {
        await client.cache.commands
          .get(interaction?.data.name)
          ?.autocompleteRun?.(rep, interaction as APIApplicationCommandAutocompleteInteraction);
        break;
      }

      case InteractionType.ModalSubmit: {
        const parsedCustomId: CustomIdData = JSON.parse(interaction?.data.custom_id);
        client.cache.commands.get(parsedCustomId.command)?.modalRun?.(rep, interaction as APIModalSubmitInteraction);
        break;
      }

      default:
        return rep.status(400).send('Unknown interaction type');
    }
  },
});

await app.listen({ port: 8008, host: '0.0.0.0' });
