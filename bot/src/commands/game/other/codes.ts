import { Category, randomColor, SubCategory, attachments } from '#constants/index';
import { Command } from '#structures/Command';
import { buildCustomId } from '#constants/components';
import { ButtonStyle, type APIChatInputApplicationCommandGuildInteraction } from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import {
  EmbedBuilder,
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
  ButtonBuilder,
} from '@discordjs/builders';

export default class Codes extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'codes',
      description: 'get all of the ingame codes',
      fullCategory: [Category.game, SubCategory.other],
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    await this.client.api.interactions.reply(res, await this.templateRun(interaction));
  }

  public override async templateRun(interaction: APIChatInputApplicationCommandGuildInteraction) {
    const codeHandler = await this.client.db.information.findUnique({ where: { type: 'codes' } });
    if (!codeHandler) return { content: 'No codes found.' };
    const embed = new EmbedBuilder()
      .setTitle('Darwinium Codes')

      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.url)
      .setDescription(codeHandler.value)
      .setFooter({ text: codeHandler.footer as string });
    const component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(
          buildCustomId({
            command: 'codes',
            action: 'expired',
            id: interaction.member.user.id,
          }),
        )
        .setLabel('View Expired Codes')
        .setStyle(ButtonStyle.Primary),
    );
    return {
      embeds: [embed.toJSON()],
      files: [attachments.currentLogo],
      components: [component.toJSON()],
    };
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
    };
  }
}
