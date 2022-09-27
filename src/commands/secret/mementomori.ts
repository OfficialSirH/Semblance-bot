import { type Message, MessageEmbed } from 'discord.js';
import { Category, randomColor, attachments } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Mementomori extends Command {
  public override name = 'mementomori';
  public override fullCategory = [Category.secret];

  public override async sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new MessageEmbed()
      .setTitle('Memento Mori')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setImage(attachments.mementoMori.name)
      .setDescription('[The Goodbye](https://www.youtube.com/watch?v=aDQ3nfBbPWM)');
    return { embeds: [embed], files: [attachments.mementoMori], ephemeral: true };
  }

  public override async messageRun(message: Message) {
    await message.delete().catch(() => null);
    await message.author.send(await this.sharedRun(message));
  }
}
