import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();
await import('#constants/index');

import prisma from '@prisma/client';
declare module 'discord.js' {
  interface Client {
    db: prisma.PrismaClient;
  }
}

declare module '@sapphire/framework' {
  class Command {
    /**
     * allows for building output for both messages and chat input interactions
     * @param builder The message that triggered the command.
     */
    sharedRun?<T extends Command['SharedBuilder']>(interaction: T): Awaitable<string | InteractionReplyOptions>;

    /**
     * allows for running through a submitted modal
     * @param interaction The interaction that triggered the command.
     */
    modalRun?(interaction: ModalSubmitInteraction): Awaitable<void>;
  }

  interface Command {
    SharedBuilder: Interaction<'cached'>;
  }
}

import { isProduction, publicKey } from '#constants/index';
import { WebhookLogger } from '#structures/WebhookLogger';
import { ApplicationCommandRegistries, LogLevel, RegisterBehavior, SapphireClient } from '@sapphire/framework';
import {
  type InteractionReplyOptions,
  type Interaction,
  type Awaitable,
  Options,
  type ModalSubmitInteraction,
  IntentsBitField,
} from 'discord.js';
import fastify from 'fastify';
import { type APIInteraction, InteractionType } from 'discord-api-types/v9';
import type { CustomIdData } from '#lib/interfaces/Semblance';
import nacl from 'tweetnacl';

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

const client = new SapphireClient({
  logger: {
    instance: new WebhookLogger(isProduction ? LogLevel.Info : LogLevel.Debug),
  },
  allowedMentions: { parse: [] },
  defaultCooldown: {
    delay: 2_000,
  },
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

await client.login(isProduction ? process.env.TOKEN : process.env.DEV_TOKEN);

const app = fastify();

app.route<{ Body: APIInteraction }>({
  url: '/interactions',
  method: 'POST',
  preHandler: async (req, res) => {
    const signature = String(req.headers['X-Signature-Ed25519']);
    const timestamp = String(req.headers['X-Signature-Timestamp']);
    const body = req.body.toString();

    const isValid = nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, 'hex'),
      Buffer.from(publicKey, 'hex'),
    );

    if (!isValid) return res.status(401).send('Invalid request signature');
  },
  handler: async (req, res) => {
    const interaction = req.body;
    if (interaction.type === InteractionType.Ping) return res.send({ type: 1 });
    if (interaction.type !== InteractionType.ModalSubmit) return res.status(200).send();
    const parsedCustomId: CustomIdData = JSON.parse(interaction?.data.custom_id);
    // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
    client.container.stores.get('commands').get(parsedCustomId.command)?.modalRun(interaction);
    return res.status(200).send();
  },
});

await app.listen({ port: 8008, host: '0.0.0.0' });
