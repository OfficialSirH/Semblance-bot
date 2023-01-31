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

export default class Roadmap extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'roadmap',
      description: 'details on the C2S Roadmap',
      fullCategory: [Category.game, SubCategory.other],
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    await this.client.api.interactions.reply(res, this.templateRun(interaction));
  }

  public override templateRun(interaction: APIChatInputApplicationCommandGuildInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('Road Map')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.url)
      .setImage(attachments.roadMap.url);
    const components = [
      new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(
              buildCustomId({
                command: 'roadmap',
                action: 'testers',
                id: interaction.member.user.id,
              }),
            )
            .setStyle(ButtonStyle.Primary)
            .setLabel('Early Beyond Testers'),
          new ButtonBuilder()
            .setCustomId(
              buildCustomId({
                command: 'roadmap',
                action: 'early-beyond',
                id: interaction.member.user.id,
              }),
            )
            .setStyle(ButtonStyle.Primary)
            .setLabel('Early Beyond Sneak Peeks'),
        )
        .toJSON(),
    ];
    return {
      embeds: [embed.toJSON()],
      files: [attachments.currentLogo, attachments.roadMap],
      components,
    };
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
    };
  }
}
