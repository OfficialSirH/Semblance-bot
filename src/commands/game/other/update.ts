import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor, Subcategories } from '#constants/index';
import { currentLogo } from '#config';
import { Command } from '@sapphire/framework';

export default class Update extends Command {
  public override name = 'update';
  public override description = 'Get info on the latest Steam and Mobile updates.';
  public override fullCategory = [Categories.game, Subcategories.other];

  public override async sharedRun() {
    const infoHandler = await this.container.client.db.information.findUnique({ where: { type: 'update' } });
    const embed = new MessageEmbed()
      .setTitle('Steam and Mobile Updates')
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setDescription(infoHandler.value);
    return { embeds: [embed], files: [currentLogo] };
  }

  public override async messageRun(message: Message) {
    await message.reply(await this.sharedRun());
  }
}
