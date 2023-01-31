import { attachments, Category, gameTransferPages, randomColor, SubCategory } from '#constants/index';
import { Command } from '#structures/Command';
import { buildCustomId } from '#constants/components';
import {
  EmbedBuilder,
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
  ButtonBuilder,
} from '@discordjs/builders';
import { ButtonStyle, type APIChatInputApplicationCommandGuildInteraction } from '@discordjs/core';

export default class GameTransfer extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'gametransfer',
      description: 'See a step-by-step guide to transfering your game progress into the cloud and onto another device.',
      fullCategory: [Category.game, SubCategory.other],
    });
  }

  public override templateRun(interaction: APIChatInputApplicationCommandGuildInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('Game Transfer')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.url)
      .setImage(gameTransferPages[0])
      .setDescription('Step 1:');
    const component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(buildCustomId({ command: 'gametransfer', action: 'left', id: interaction.member.user.id }))
        .setEmoji({ name: '⬅️' })
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(
          buildCustomId({
            command: 'gametransfer',
            action: 'right',
            id: interaction.member.user.id,
          }),
        )
        .setEmoji({ name: '➡️' })
        .setStyle(ButtonStyle.Primary),
    );
    return {
      embeds: [embed.toJSON()],
      files: [attachments.currentLogo],
      components: [component.toJSON()],
    };
  }
}
