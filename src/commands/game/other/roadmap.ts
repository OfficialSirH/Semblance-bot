import type { Message } from 'discord.js';
import { Categories, Subcategories } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Roadmap extends Command {
  public override name = 'roadmap';
  public override description = 'details on the C2S Roadmap';
  public override fullCategory = [Categories.game, Subcategories.other];

  public override async messageRun(message: Message) {
    const options = await this.container.client.stores.get('infoBuilders').get(this.name).build(message);
    await message.channel.send(options);
  }
}
