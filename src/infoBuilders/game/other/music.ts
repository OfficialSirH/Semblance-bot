import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { currentLogo } from '#config';

export default class Music extends InfoBuilder {
  public override name = 'music';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Music')
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setDescription(
        [
          `Here's a link to the music, ${user.tag}`,
          '[Fandom Wiki](https://cell-to-singularity-evolution.fandom.com/wiki/music)',
          '[Spotify Link](https://open.spotify.com/playlist/6XcJkgtRFpKwoxKleKIOOp?si=uR4gzciYQtKiXGPwY47v6w)',
        ].join('\n'),
      );
    return { embeds: [embed], files: [currentLogo] };
  }
}
