import { type Message, EmbedBuilder } from 'discord.js';
import { Category, randomColor, Subcategory, attachments } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Update extends Command {
  public override name = 'update';
  public override description = 'Get info on the latest Steam and Mobile updates.';
  public override fullCategory = [Category.game, Subcategory.other];

  public override async sharedRun() {
    const infoHandler = await this.container.client.db.information.findUnique({ where: { type: 'update' } });
    const embed = new EmbedBuilder()
      .setTitle('Steam and Mobile Updates')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setDescription(infoHandler.value);
    return { embeds: [embed], files: [attachments.currentLogo.attachment] };
  }

  public override async messageRun(message: Message) {
    await message.reply(await this.sharedRun());
  }
}
