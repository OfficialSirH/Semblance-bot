import { Category, randomColor, SubCategory, attachments } from '#constants/index';
import { Command } from '#structures/Command';

export default class PrestigeList extends Command {
  public override name = 'prestigelist';
  public override description = 'A list of the Mesozoic Valley Prestige ranks.';
  public override category = [Category.game, SubCategory.mesozoic];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const embed = new EmbedBuilder()
      .setTitle('Mesozoic Valley Prestige List')
      .setAuthor(interaction.user)
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo)
      .setImage(attachments.prestigeList)
      .setFooter({ text: 'Thanks to Hardik for this lovely list of Prestige :D' });
    return {
      embeds: [embed.toJSON()],
      files: [attachments.currentLogo.attachment, attachments.prestigeList.attachment],
    };
  }
}
