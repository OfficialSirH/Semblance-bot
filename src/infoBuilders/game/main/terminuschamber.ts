import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { currentLogo, terminusChamber } from '#config';

export default class Terminuschamber extends InfoBuilder {
  public override name = 'terminuschamber';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Terminus Chamber')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setImage(terminusChamber.name)
      .setDescription(
        [
          '**Yellow Cube** - ||Explore the Mesozoic Valley||',
          '**Purple Cube** - ||Unlock Singularity for the first time||',
          '**Light Pink Cube** - ||Unlock the human brain||',
          '**Light Blue Cube** - ||Obtain/Evolve Neoaves||',
          '**Blue Cube** - ||Unlock Cetaceans||',
          '**Lime Green Cube** - ||Unlock Crocodilians||',
          '**Orange Cube** - ||Unlock Feliforms||',
          '**Red Cube** - ||Terraform Mars||',
        ].join('\n'),
      );
    return {
      embeds: [embed],
      files: [currentLogo, terminusChamber],
    };
  }
}
