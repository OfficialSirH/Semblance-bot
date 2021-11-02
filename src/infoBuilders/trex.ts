import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';
import config from '#config';

export const build: QueriedInfoBuilder = () => {
  const { trexBadge, currentLogo } = config;
  const embed = new MessageEmbed()
    .setTitle(`${trexBadge}Tyrannosaurus Rex`)
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(
      'The T-Rex, the rightful king of the Mesozoic Valley, can be unlocked at Rank 26 in the Mesozoic Valley, which will also earn you an achievement called, "Birth of a Tyrant".',
    );
  return { embeds: [embed], files: [currentLogo] };
};
