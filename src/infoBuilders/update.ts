import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { currentLogo } from '#config';

export default class Update extends InfoBuilder {
  public override name = 'update';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build() {
    const infoHandler = await this.container.client.db.information.findUnique({ where: { type: 'update' } });
    const embed = new Embed()
      .setTitle('Steam and Mobile Updates')
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setDescription(infoHandler.value);
    return { embeds: [embed], files: [currentLogo] };
  }
}
