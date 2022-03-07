import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor, Subcategories } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Feedback extends Command {
  public override name = 'feedback';
  public override description = 'Provide feedback to the developers of C2S with the given email.';
  public override fullCategory = [Categories.game, Subcategories.other];

  public override sharedRun(builder: Command['SharedBuilder']) {
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

  public async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
