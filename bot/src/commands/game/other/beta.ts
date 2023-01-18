import { attachments, Category, randomColor, SubCategory } from '#constants/index';
import { Command } from '#structures/Command';

export default class Beta extends Command {
  public override name = 'beta';
  public override description = 'Get info on the latest beta.';
  public override category = [Category.game, SubCategory.other];

  public override async sharedRun() {
    const infoHandler = await this.client.db.information.findUnique({ where: { type: 'beta' } });
    if (!infoHandler) return 'No beta info found.';
    const embed = new EmbedBuilder()
      .setTitle('Beta')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo)
      .setDescription(infoHandler.value)
      .setFooter({ text: 'New stuff do be epicc' });
    return { embeds: [embed.toJSON()], files: [attachments.currentLogo.attachment] };
  }
}
