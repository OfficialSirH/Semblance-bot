import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { ActionRow, ButtonComponent, ButtonStyle, Embed } from 'discord.js';
import { currentLogo, roadMap } from '#config';
import type { Piece } from '@sapphire/framework';

export default class Roadmap extends InfoBuilder {
  public override name = 'roadmap';

  public constructor(context: Piece.Context) {
    super(context);
  }

  public override async build() {
    const embed = new Embed()
      .setTitle('Road Map')
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setImage(roadMap.name);
    const components = [
      new ActionRow().addComponents(
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'roadmap',
              action: 'testers',
            }),
          )
          .setStyle(ButtonStyle.Primary)
          .setLabel('Early Beyond Testers'),
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'roadmap',
              action: 'early-beyond',
            }),
          )
          .setStyle(ButtonStyle.Primary)
          .setLabel('Early Beyond Sneak Peeks'),
      ),
    ];
    return { embeds: [embed], files: [currentLogo, roadMap], components };
  }
}
