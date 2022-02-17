import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { currentLogo } from '#config';

export default class Reboot extends InfoBuilder {
  public override name = 'reboot';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build() {
    const embed = new Embed()
      .setTitle('Reboot')
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setDescription(
        '**Reboot\'s location:** You can find the "Simulation Reboot" by  clicking on the (metabit) bar under your currency (entropy/ideas).\n' +
          '**The importance of rebooting your simulation:** you gain metabits from your stimulation, which in order to use them and unlock their potential you need to reboot your stimulation.' +
          'rebooting also offers a lot of speed boost and rewards',
      );
    return { embeds: [embed], files: [currentLogo] };
  }
}
