import { Category, randomColor, SubCategory } from '#constants/index';
import { Command } from '#structures/Command';

export default class Feedback extends Command {
  public override name = 'feedback';
  public override description = 'Provide feedback to the developers of C2S with the given email.';
  public override category = [Category.game, SubCategory.other];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const feedbackImage = 'https://i.imgur.com/lKQh5zW.png';
    const embed = new EmbedBuilder()
      .setTitle('Feedback')
      .setAuthor(interaction.user)
      .setColor(randomColor)
      .setDescription("Give feedback for ComputerLunch's game, C2S.")
      .setImage(feedbackImage);
    return { embeds: [embed] };
  }
}
