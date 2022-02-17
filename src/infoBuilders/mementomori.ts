import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed, Message } from 'discord.js';
import { mementoMori } from '#config';

export default class Mementomori extends InfoBuilder {
  public override name = 'mementomori';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Memento Mori')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setImage(mementoMori.name)
      .setDescription('[The Goodbye](https://www.youtube.com/watch?v=aDQ3nfBbPWM)');
    return builder instanceof Message
      ? { embeds: [embed], files: [mementoMori] }
      : { embeds: [embed], files: [mementoMori], ephemeral: true };
  }
}
