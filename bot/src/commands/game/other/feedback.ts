import { EmbedBuilder } from 'discord.js';
import { Category, randomColor, Subcategory } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Feedback extends Command {
  public override name = 'feedback';
  public override description = 'Provide feedback to the developers of C2S with the given email.';
  public override fullCategory = [Category.game, Subcategory.other];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const feedbackImage = 'https://i.imgur.com/lKQh5zW.png';
    const embed = new EmbedBuilder()
      .setTitle('Feedback')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setColor(randomColor)
      .setDescription("Give feedback for ComputerLunch's game, C2S.")
      .setImage(feedbackImage);
    return { embeds: [embed] };
  }
}
