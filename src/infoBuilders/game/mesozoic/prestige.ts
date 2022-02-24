import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { prestige, currentLogo } from '#config';

export default class Prestige extends InfoBuilder {
  public override name = 'prestige';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Mesozoic Valley Prestige')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setImage(prestige.name)
      .setThumbnail(currentLogo.name)
      .setDescription(
        'Prestige in the Mesozoic Valley is unlocked at rank 50, which is also the rank that is recommended to purchase the diamond geode. ' +
          'Prestige also allows you to keep your Mutagen.',
      )
      .setFooter({ text: 'Prestige goes brrr...' });
    return { embeds: [embed], files: [currentLogo, prestige] };
  }
}
