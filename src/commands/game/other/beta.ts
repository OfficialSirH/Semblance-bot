import { type Message, EmbedBuilder } from 'discord.js';
import { attachments, Category, randomColor, Subcategory } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Beta extends Command {
  public override name = 'beta';
  public override description = 'Get info on the latest beta.';
  public override fullCategory = [Category.game, Subcategory.other];

  public override async sharedRun() {
    const infoHandler = await this.container.client.db.information.findUnique({ where: { type: 'beta' } });
    const embed = new EmbedBuilder()
      .setTitle('Beta')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setDescription(infoHandler.value)
      .setFooter({ text: 'New stuff do be epicc' });
    return { embeds: [embed], files: [attachments.currentLogo.attachment] };
  }

  public async messageRun(message: Message) {
    await message.reply(await this.sharedRun());
  }
}
