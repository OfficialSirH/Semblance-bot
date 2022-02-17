import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { archieDance } from '#config';
import { Embed } from 'discord.js';

export default class Archiedance extends InfoBuilder {
  public override name = 'archiedance';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Dancing Archie/Jotaru')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setDescription(
        'Click the link above for the epic 3 minute video with Archie and Jotaru dancing, which I made as suggested by McScrungledorf#6020. ' +
          "Also, above is a short video of Archie's dance animation from the game :P",
      )
      .setURL('https://drive.google.com/file/d/1twLIqvEG-wwZJFmhtSERWBM5KoJ3zmkg/view?usp=sharing');

    return { embeds: [embed], files: [archieDance] };
  }
}
