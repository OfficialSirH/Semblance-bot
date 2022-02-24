import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { currentLogo, prestigeList } from '#config';

export default class Prestigelist extends InfoBuilder {
  public override name = 'prestigelist';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Mesozoic Valley Prestige List')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setImage(prestigeList.name)
      .setFooter({ text: 'Thanks to Hardik for this lovely list of Prestige :D' });
    return { embeds: [embed], files: [currentLogo, prestigeList] };
  }
}
