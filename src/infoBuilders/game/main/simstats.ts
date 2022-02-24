import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { currentLogo, simStatsLocation } from '#config';

export default class Simstats extends InfoBuilder {
  public override name = 'simstats';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build() {
    const embed = new Embed()
      .setTitle('Simulation Statistics')
      .setThumbnail(currentLogo.name)
      .setColor(randomColor)
      .setImage(simStatsLocation.name)
      .setDescription(
        'Clicking your currency(Image 1) will open the Semblance/Reality Engine, which looking towards the left side of the engine will have a sliding button(Image 2) that will show your game stats.',
      );
    return {
      embeds: [embed],
      files: [currentLogo, simStatsLocation],
    };
  }
}
