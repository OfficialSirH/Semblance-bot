import { EmbedBuilder } from 'discord.js';
import { Category, randomColor, Subcategory, attachments } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class JoinBeta extends Command {
  public override name = 'joinbeta';
  public override description = 'Info on how to become a beta tester';
  public override fullCategory = [Category.game, Subcategory.other];

  public override async sharedRun(interaction: Command['SharedBuilder']) {
    const infoHandler = await interaction.client.db.information.findUnique({ where: { type: 'joinbeta' } });
    if (!infoHandler) return 'No join beta info found.';
    const embed = new EmbedBuilder()
      .setTitle('Steps to join beta')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setFooter({ text: `Called by ${interaction.user.tag}` })
      .setDescription(infoHandler.value);
    return { embeds: [embed], files: [attachments.currentLogo.attachment] };
  }
}
