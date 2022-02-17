import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';

export default class Changelog extends InfoBuilder {
  public override name = 'changelog';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const changelogHandler = await builder.client.db.information.findUnique({ where: { type: 'changelog' } });
    const embed = new Embed()
      .setTitle('Changelog')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setDescription(changelogHandler.value);
    return { embeds: [embed] };
  }
}
