import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { trexSkull, currentLogo } from '#config';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import type { Piece } from '@sapphire/framework';

export default class Dinos extends InfoBuilder {
  public override name = 'dinos';

  public constructor(context: Piece.Context) {
    super(context);
  }

  public override async build() {
    const embed = new Embed()
      .setTitle(`${trexSkull} Mesozoic Valley`)
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setDescription(
        [
          'The Mesozoic Valley is a separate simulation that consists of dinosaurs, which provides insight for Semblance on what the demise of the human species could be',
          [
            '**Location:**\nlook to the right side of the tetrapods in the evolution tree, the Mesozoic Valley should be right next to egg shells and it should look like a rock,',
            "unless you already opened it and it's a skull instead, which you can also find it located at the top right with a skull button.",
            "Also, the more you rank up in Mesozoic Valley, the better of a boost you'll gain in the main simulation",
          ].join(' '),
        ].join('\n\n'),
      );
    return { embeds: [embed], files: [currentLogo] };
  }
}
