import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { sharks, currentLogo } from '#config';

export default class Sharks extends InfoBuilder {
  public override name = 'sharks';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build() {
    const embed = new Embed()
      .setTitle('Sharks')
      .setColor(randomColor)
      .setImage(sharks.name)
      .setThumbnail(currentLogo.name)
      .setDescription(
        'There are six sharks within the game that can be unlocked within the daily rewards individually every 14 days, which takes 84 days to unlock all of them, which will give you the achievement, "Shark Week".\n They\'re unlocked in this order: \n' +
          '1. Leopard Shark \n 2. Whale Shark \n 3. Tiger Shark \n 4. Great White \n 5. Hammerhead \n 6. **MEGALODON!!**',
      );
    return { embeds: [embed], files: [currentLogo, sharks] };
  }
}
