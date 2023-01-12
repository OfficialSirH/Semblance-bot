import { Category, randomColor, SubCategory, attachments } from '#constants/index';
import { Command } from '#structures/Command';

export default class Update extends Command {
  public override name = 'update';
  public override description = 'Get info on the latest Steam and Mobile updates.';
  public override category = [Category.game, SubCategory.other];

  public override async sharedRun() {
    const infoHandler = await this.client.db.information.findUnique({ where: { type: 'update' } });
    if (!infoHandler) return 'No update info found.';
    const embed = new EmbedBuilder()
      .setTitle('Steam and Mobile Updates')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo)
      .setDescription(infoHandler.value);
    return { embeds: [embed], files: [attachments.currentLogo.attachment] };
  }
}
