import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';
import config from '#config';

export const build: QueriedInfoBuilder = () => {
  const { currentLogo, simStatsLocation } = config;
  const embed = new MessageEmbed()
    .setTitle('Simulation Statistics')
    .setThumbnail(currentLogo.name)
    .setColor(randomColor)
    .setImage(simStatsLocation.name)
    .setDescription(
      'Clicking your currency(Image 1) will open the Semblance/Reality Engine, which looking towards the left side of the engine will have a sliding button(Image 2) that will show your game stats.',
    );
  return {
    embeds: [embed],
    files: [currentLogo, simStatsLocation],
  };
};
