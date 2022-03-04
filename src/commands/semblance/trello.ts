import { Embed, type Message } from 'discord.js';
import { Categories, randomColor } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Trello extends Command {
  public override name = 'trello';
  public override description = 'Gets an invite link for the bot and support server.';
  public override fullCategory = [Categories.semblance];

  public override sharedRun() {
    const embed = new Embed()
      .setDescription("[Semblance's Trello board](https://trello.com/b/Zhrs5AaN/semblance-project)")
      .setColor(randomColor);
    return { embeds: [embed] };
  }

  public async messageRun(message: Message) {
    await message.reply(this.sharedRun());
  }
}
