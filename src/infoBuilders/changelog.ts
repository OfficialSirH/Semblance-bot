import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import type { Piece } from '@sapphire/framework';
import type { InfoBuilderOption } from 'Semblance';

export default class Changelog extends InfoBuilder {
  public override name = 'changelog';

  public constructor(context: Piece.Context) {
    super(context);
  }

  public override async build(builder: InfoBuilderOption) {
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
