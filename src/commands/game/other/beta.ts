import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { currentLogo } from '#config';
import { Categories, randomColor, Subcategories } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Beta extends Command {
  public override name = 'beta';
  public override description = 'Get info on the latest beta.';
  public override fullCategory = [Categories.game, Subcategories.other];

  public async messageRun(message: Message) {
    const infoHandler = await this.container.client.db.information.findUnique({ where: { type: 'beta' } });
    const embed = new Embed()
      .setTitle('Beta')
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setDescription(infoHandler.value)
      .setFooter({ text: 'New stuff do be epicc' });
    message.channel.send({ embeds: [embed], files: [currentLogo] });
  }
}
