import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import type { InfoBuilderOption } from 'Semblance';
import type { Piece } from '@sapphire/framework';

export default class Feedback extends InfoBuilder {
  public override name = 'feedback';

  public constructor(context: Piece.Context) {
    super(context);
  }

  public override async build(builder: InfoBuilderOption) {
    const user = 'user' in builder ? builder.user : builder.author;
    const feedbackImage = 'https://i.imgur.com/lKQh5zW.png';
    const embed = new Embed()
      .setTitle('Feedback')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setDescription("Give feedback for ComputerLunch's game, C2S.")
      .setImage(feedbackImage);
    return { embeds: [embed] };
  }
}
