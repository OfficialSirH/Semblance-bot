import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { currentLogo } from '#config';

export default class Joinbeta extends InfoBuilder {
  public override name = 'joinbeta';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const infoHandler = await builder.client.db.information.findUnique({ where: { type: 'joinbeta' } });
    const embed = new Embed()
      .setTitle('Steps to join beta')
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setFooter({ text: `Called by ${user.tag}` })
      .setDescription(infoHandler.value);
    return { embeds: [embed], files: [currentLogo] };
  }
}
