import { currentLogo } from '#config';
import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';

export default class Beta extends InfoBuilder {
  public override name = 'beta';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build() {
    const infoHandler = await this.container.client.db.information.findUnique({ where: { type: 'beta' } });
    const embed = new Embed()
      .setTitle('Beta')
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setDescription(infoHandler.value)
      .setFooter({ text: 'New stuff do be epicc' });
    return { embeds: [embed], files: [currentLogo] };
  }
}
