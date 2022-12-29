import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();
await import('#constants/index');
import prisma from '@prisma/client';

declare module '@sapphire/framework' {
  interface SapphireClient {
    cache: {
      guilds: Collection<Snowflake, APIGuild>;
      applicationCommands: Collection<Snowflake, APIApplicationCommand>;
    };
    db: prisma.PrismaClient;
    api: FastifyBasedAPI;
  }
  class Command {
    /**
     * The response for interactions that don't require much more than static data.
     */
    template?: Omit<APIInteractionResponse, 'type'> & Partial<Pick<APIInteractionResponse, 'type'>>;

    /**
     * executes application commands
     * @param interaction The interaction that triggered the command.
     */
    applicationRun?(reply: FastifyReply, interaction: APIApplicationCommandInteraction): Awaitable<void>;

    /**
     * executes message components
     * @param interaction The interaction that triggered the command.
     */
    componentRun?(reply: FastifyReply, interaction: APIMessageComponentInteraction): Awaitable<void>;

    /**
     * executes autocomplete commands
     * @param interaction The interaction that triggered the command.
     */
    autocomplete?(
      reply: FastifyReply,
      interaction: APIApplicationCommandAutocompleteInteraction,
    ): Awaitable<APIApplicationCommandOptionChoice[]>;

    /**
     * executes a modal
     * @param interaction The interaction that triggered the command.
     */
    modalRun?(reply: FastifyReply, interaction: APIModalSubmitInteraction): Awaitable<void>;
  }

  interface Command {
    SharedBuilder: APIInteraction;
    defaultTemplate: Omit<APIInteractionResponseChannelMessageWithSource, 'type'> &
      Partial<Pick<APIInteractionResponseChannelMessageWithSource, 'type'>>;
  }
}

import { isProduction, publicKey, UserId } from '#constants/index';
import { WebhookLogger } from '#structures/WebhookLogger';
import {
  ApplicationCommandRegistries,
  type Awaitable,
  LogLevel,
  RegisterBehavior,
  SapphireClient,
} from '@sapphire/framework';
import fastify, { type FastifyReply } from 'fastify';
import {
  InteractionType,
  InteractionResponseType,
  type APIApplicationCommandInteraction,
  type APIMessageComponentInteraction,
  type APIApplicationCommandAutocompleteInteraction,
  type APIModalSubmitInteraction,
  type APIInteractionResponse,
  type APIInteractionResponseChannelMessageWithSource,
  type APIApplicationCommandOptionChoice,
  type APIInteraction,
} from 'discord-api-types/v9';
import type { CustomIdData } from '#lib/interfaces/Semblance';
import nacl from 'tweetnacl';
import { FastifyBasedAPI } from '#structures/DiscordAPI';
import { type APIGuild, GatewayIntentBits, type Snowflake, type APIApplicationCommand } from '@discordjs/core';
import type { Collection } from '@discordjs/collection';

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

const client = new SapphireClient({
  logger: {
    instance: new WebhookLogger(isProduction ? LogLevel.Info : LogLevel.Debug),
  },
  allowedMentions: { parse: [] },
  intents: [GatewayIntentBits.Guilds],
});
// client.prepare = async () => {
//   // Loads all stores, then call login:
//   await Promise.all([...this.stores.values()].map(store => store.loadAll()));
//   const login = await super.login(token);
//   return login;
// };
client.db = new prisma.PrismaClient();
client.api = new FastifyBasedAPI(isProduction ? process.env.TOKEN : process.env.DEV_TOKEN);

await client.login(isProduction ? process.env.TOKEN : process.env.DEV_TOKEN);

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
        await client.stores.get('commands').get(interaction?.data.name)?.applicationRun?.(rep, interaction);
        break;

      case InteractionType.MessageComponent: {
        client.stores.get('commands').get(interaction?.data.custom_id)?.componentRun?.(rep, interaction);
        break;
      }

      case InteractionType.ApplicationCommandAutocomplete: {
        await client.stores.get('commands').get(interaction?.data.name)?.autocomplete?.(rep, interaction);
        break;
      }

      case InteractionType.ModalSubmit: {
        const parsedCustomId: CustomIdData = JSON.parse(interaction?.data.custom_id);
        client.stores.get('commands').get(parsedCustomId.command)?.modalRun?.(rep, interaction);
        break;
      }

      default:
        return rep.status(400).send('Unknown interaction type');
    }
  },
});

await app.listen({ port: 8008, host: '0.0.0.0' });
