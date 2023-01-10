import { EmbedBuilder } from 'discord.js';
import { attachments, Category, randomColor, Subcategory } from '#constants/index';
import { Command } from '#structures/Command';

export default class Beta extends Command {
  public override name = 'beta';
  public override description = 'Get info on the latest beta.';
  public override category = [Category.game, Subcategory.other];

  public override async sharedRun() {
    const infoHandler = await this.client.db.information.findUnique({ where: { type: 'beta' } });
    if (!infoHandler) return 'No beta info found.';
    const embed = new EmbedBuilder()
      .setTitle('Beta')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setDescription(infoHandler.value)
      .setFooter({ text: 'New stuff do be epicc' });
    return { embeds: [embed], files: [attachments.currentLogo.attachment] };
  }
}
