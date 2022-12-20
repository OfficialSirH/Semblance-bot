import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();
await import('#constants/index');

import prisma from '@prisma/client';
declare module 'discord.js' {
  interface Client {
    db: prisma.PrismaClient;
    app: FastifyInstance;
  }
}

declare module '@sapphire/framework' {
  class Command {
    /**
     * The response for interactions that don't require much more than static data.
     */
    template?: Omit<APIInteractionResponse, 'type'> & Partial<Pick<APIInteractionResponse, 'type'>>;

    /**
     * executes application commands
     * @param interaction The interaction that triggered the command.
     */
    applicationRun?(interaction: APIApplicationCommandInteraction): Awaitable<void>;

    /**
     * executes message components
     * @param interaction The interaction that triggered the command.
     */
    componentRun?(interaction: APIMessageComponentInteraction): Awaitable<void>;

    /**
     * executes autocomplete commands
     * @param interaction The interaction that triggered the command.
     */
    autocomplete?(
      interaction: APIApplicationCommandAutocompleteInteraction,
    ): Awaitable<APIApplicationCommandOptionChoice[]>;

    /**
     * executes a modal
     * @param interaction The interaction that triggered the command.
     */
    modalRun?(interaction: APIModalSubmitInteraction): Awaitable<void>;
  }

  interface Command {
    SharedBuilder: APIInteraction;
    defaultTemplate: Omit<APIInteractionResponseChannelMessageWithSource, 'type'> &
      Partial<Pick<APIInteractionResponseChannelMessageWithSource, 'type'>>;
  }
}

import { isProduction, publicKey, UserId } from '#constants/index';
import { WebhookLogger } from '#structures/WebhookLogger';
import { ApplicationCommandRegistries, LogLevel, RegisterBehavior, SapphireClient } from '@sapphire/framework';
import { type Awaitable, Options, IntentsBitField } from 'discord.js';
import fastify, { type FastifyInstance } from 'fastify';
import {
  type APIInteraction,
  InteractionType,
  InteractionResponseType,
  type APIApplicationCommandInteraction,
  type APIMessageComponentInteraction,
  type APIApplicationCommandAutocompleteInteraction,
  type APIModalSubmitInteraction,
  type APIInteractionResponse,
  type APIInteractionResponseChannelMessageWithSource,
  APIApplicationCommandOptionWithAutocompleteOrChoicesWrapper,
  APIApplicationCommandOptionChoice,
} from 'discord-api-types/v9';
import type { CustomIdData } from '#lib/interfaces/Semblance';
import nacl from 'tweetnacl';

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

const client = new SapphireClient({
  logger: {
    instance: new WebhookLogger(isProduction ? LogLevel.Info : LogLevel.Debug),
  },
  allowedMentions: { parse: [] },
  makeCache: Options.cacheWithLimits({
    GuildMemberManager: 10,
    UserManager: {
      maxSize: 10,
      keepOverLimit: user => user.id === '794033850665533450',
    },
  }),
  intents: [IntentsBitField.Flags.Guilds],
});
client.db = new prisma.PrismaClient();

const app = fastify();
client.app = app;

await client.login(isProduction ? process.env.TOKEN : process.env.DEV_TOKEN);

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
  handler: async (req, res) => {
    const interaction = req.body;
    if (interaction.type === InteractionType.Ping) return res.send({ type: InteractionResponseType.Pong });

    if (interaction.member?.user?.id === UserId.sirh) client.logger.info('Sirh test', interaction);
    else return res.status(400).send('not sirh');

    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        try {
          await client.stores.get('commands').get(interaction?.data.name)?.applicationRun?.(interaction);
        } catch (e) {
          client.logger.error(e);
        }
        break;

      case InteractionType.MessageComponent: {
        client.stores.get('commands').get(interaction?.data.custom_id)?.componentRun?.(interaction);
        break;
      }

      case InteractionType.ApplicationCommandAutocomplete: {
        await client.stores.get('commands').get(interaction?.data.name)?.autocompleteRun?.(interaction);
        break;
      }

      case InteractionType.ModalSubmit: {
        const parsedCustomId: CustomIdData = JSON.parse(interaction?.data.custom_id);
        client.stores.get('commands').get(parsedCustomId.command)?.modalRun?.(interaction);
        break;
      }

      default:
        return res.status(400).send('Unknown interaction type');
    }
  },
});

await app.listen({ port: 8008, host: '0.0.0.0' });
