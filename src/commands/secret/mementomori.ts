import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor } from '#constants/index';
import { mementoMori } from '#config';
import { Command } from '@sapphire/framework';

export default class Mementomori extends Command {
  public override name = 'mementomori';
  public override fullCategory = [Categories.secret];

  public override async sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Memento Mori')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setImage(mementoMori.name)
      .setDescription('[The Goodbye](https://www.youtube.com/watch?v=aDQ3nfBbPWM)');
    return { embeds: [embed], files: [mementoMori], ephemeral: true };
  }

  public override async messageRun(message: Message) {
    await message.delete().catch(() => null);
    await message.author.send(await this.sharedRun(message));
  }
}
