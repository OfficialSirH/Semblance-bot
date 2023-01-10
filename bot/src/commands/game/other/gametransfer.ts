import { attachments, Category, gameTransferPages, randomColor, Subcategory } from '#constants/index';
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type MessageActionRowComponentBuilder,
} from 'discord.js';
import { Command } from '#structures/Command';
import { buildCustomId } from '#constants/components';

export default class GameTransfer extends Command {
  public override name = 'gametransfer';
  public override description =
    'See a step-by-step guide to transfering your game progress into the cloud and onto another device.';
  public override category = [Category.game, Subcategory.other];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const { user } = interaction;
    const embed = new EmbedBuilder()
      .setTitle('Game Transfer')
      .setColor(randomColor)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(attachments.currentLogo.name)
      .setImage(gameTransferPages[0])
      .setDescription('Step 1:');
    const component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(buildCustomId({ command: 'gametransfer', action: 'left', id: user.id }))
        .setEmoji('⬅️')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(
          buildCustomId({
            command: 'gametransfer',
            action: 'right',
            id: user.id,
          }),
        )
        .setEmoji('➡️')
        .setStyle(ButtonStyle.Primary),
    );
    return {
      embeds: [embed],
      files: [attachments.currentLogo.attachment],
      components: [component],
    };
  }
}
