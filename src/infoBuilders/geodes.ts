import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { Embed } from 'discord.js';
import { currentLogo, geodeImage } from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const embed = new Embed()
    .setTitle('Geodes Comparison')
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setThumbnail(currentLogo.name)
    .setImage(geodeImage.name)
    .setDescription(
      'The top row of the image represents the rewards from each geode at rank 50, ' +
        'while the bottom row represents the geode rewards at rank 4, ' +
        "which rank 4 is shown instead of 1 because the diamond geode isn't unlocked until rank 4. " +
        "By the shown results within this image, it's highly recommended to get geodes at rank 50 for the greatest rewards for the same price as rank 4.",
    )
    .setFooter({ text: 'Diamond Geodes for da win!' });
  return { embeds: [embed], files: [currentLogo, geodeImage] };
};
