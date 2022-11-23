import { EmbedBuilder } from 'discord.js';
import { Category, randomColor, Subcategory, attachments } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class PrestigeList extends Command {
  public override name = 'prestigelist';
  public override description = 'A list of the Mesozoic Valley Prestige ranks.';
  public override fullCategory = [Category.game, Subcategory.mesozoic];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const embed = new EmbedBuilder()
      .setTitle('Mesozoic Valley Prestige List')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setImage(attachments.prestigeList.name)
      .setFooter({ text: 'Thanks to Hardik for this lovely list of Prestige :D' });
    return { embeds: [embed], files: [attachments.currentLogo.attachment, attachments.prestigeList.attachment] };
  }
}
