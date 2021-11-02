import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';
import config from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const { currentLogo } = config;
  const embed = new MessageEmbed()
    .setTitle('Music')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(
      [
        `Here's a link to the music, ${interaction.user.tag}`,
        '[Fandom Wiki](https://cell-to-singularity-evolution.fandom.com/wiki/music)',
        '[Spotify Link](https://open.spotify.com/playlist/6XcJkgtRFpKwoxKleKIOOp?si=uR4gzciYQtKiXGPwY47v6w)',
      ].join('\n'),
    );
  return { embeds: [embed], files: [currentLogo] };
};
