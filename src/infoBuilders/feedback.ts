import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';

export default class Feedback extends InfoBuilder {
  public override name = 'feedback';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
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
