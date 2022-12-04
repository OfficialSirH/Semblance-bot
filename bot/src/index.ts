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
  intents: [],
});
client.db = new prisma.PrismaClient();

client.rest.setToken(isProduction ? process.env.TOKEN : process.env.DEV_TOKEN);
client.stores.get('listeners').get('ready')?.run(client);

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

    // chunk of InteractionCreateAction from discord.js, will implement as something useable in this case
    // // Do not emit this for interactions that cache messages that are non-text-based.
    // let InteractionClass;

    // switch (data.type) {
    //   case InteractionType.ApplicationCommand:
    //     switch (data.data.type) {
    //       case ApplicationCommandType.ChatInput:
    //         InteractionClass = ChatInputCommandInteraction;
    //         break;
    //       case ApplicationCommandType.User:
    //         InteractionClass = UserContextMenuCommandInteraction;
    //         break;
    //       case ApplicationCommandType.Message:
    //         // if (channel && !channel.isTextBased()) return;
    //         InteractionClass = MessageContextMenuCommandInteraction;
    //         break;
    //       default:
    //         client.logger.warn(
    //           `[INTERACTION] Received application command interaction with unknown type: ${data.data.type}`,
    //         );
    //         return;
    //     }
    //     break;
    //   case InteractionType.MessageComponent:
    //     // if (channel && !channel.isTextBased()) return;

    //     switch (data.data.component_type) {
    //       case ComponentType.Button:
    //         InteractionClass = ButtonInteraction;
    //         break;
    //       case ComponentType.StringSelect:
    //         InteractionClass = StringSelectMenuInteraction;
    //         break;
    //       case ComponentType.UserSelect:
    //         InteractionClass = UserSelectMenuInteraction;
    //         break;
    //       case ComponentType.RoleSelect:
    //         InteractionClass = RoleSelectMenuInteraction;
    //         break;
    //       case ComponentType.MentionableSelect:
    //         InteractionClass = MentionableSelectMenuInteraction;
    //         break;
    //       case ComponentType.ChannelSelect:
    //         InteractionClass = ChannelSelectMenuInteraction;
    //         break;
    //       default:
    //         client.logger.warn(
    //           `[INTERACTION] Received component interaction with unknown type: ${data.data.component_type}`,
    //         );
    //         return;
    //     }
    //     break;
    //   case InteractionType.ApplicationCommandAutocomplete:
    //     InteractionClass = AutocompleteInteraction;
    //     break;
    //   case InteractionType.ModalSubmit:
    //     InteractionClass = ModalSubmitInteraction;
    //     break;
    //   default:
    //     client.logger.warn(`[INTERACTION] Received interaction with unknown type: ${data.type}`);
    //     return;
    // }

    // // @ts-expect-error - I need to use these classes for an ease of abstracted interactions
    // const interaction = new InteractionClass(client, data);
  },
});

await app.listen({ port: 8008, host: '0.0.0.0' });
