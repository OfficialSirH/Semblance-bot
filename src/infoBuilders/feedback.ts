import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';

export const build: QueriedInfoBuilder = interaction => {
  const feedbackImage = 'https://i.imgur.com/lKQh5zW.png';
  const embed = new Embed()
    .setTitle('Feedback')
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setColor(randomColor)
    .setDescription("Give feedback for ComputerLunch's game, C2S.")
    .setImage(feedbackImage);
  return { embeds: [embed] };
};
