import { Category, GuildId, PreconditionName } from '#constants/index';
import { fetchDeepL } from '#constants/commands';
import { Command } from '#structures/Command';
import {
  ApplicationCommandType,
  PermissionFlagsBits,
  type RESTPostAPIApplicationCommandsJSONBody,
  type APIMessageApplicationCommandInteraction,
  MessageFlags,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class Translate extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'translate',
      description: 'Translates a message to English.',
      fullCategory: [Category.c2sServer],
      preconditions: [PreconditionName.ModOnly],
    });
  }

  public override async contextMenuRun(res: FastifyReply, interaction: APIMessageApplicationCommandInteraction) {
    const message = interaction.data.resolved.messages[interaction.data.target_id];
    if (!message)
      return this.client.api.interactions.reply(res, { content: 'Invalid message.', flags: MessageFlags.Ephemeral });

    await this.client.api.interactions.deferReply(res, { flags: MessageFlags.Ephemeral });
    const translateData = await fetchDeepL({ text: message.content });

    return this.client.api.interactions.editReply(interaction, {
      content: `Language: ${translateData.detected_source_language}\n\n${translateData.text}`,
    });
  }

  public override data() {
    return {
      command: {
        name: this.name,
        type: ApplicationCommandType.Message,
        default_member_permissions: PermissionFlagsBits.ManageMessages.toString(),
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
      guildIds: [GuildId.cellToSingularity],
    };
  }
}
