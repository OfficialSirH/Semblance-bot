import config from '#config';
import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { Information } from '#models/Information';
import { MessageEmbed } from 'discord.js';

export const build: QueriedInfoBuilder = async () => {
  const { currentLogo } = config;
  const infoHandler = await Information.findOne({ infoType: 'beta' });
  const embed = new MessageEmbed()
    .setTitle('Beta')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(infoHandler.info)
    .setFooter('New stuff do be epicc');
  return { embeds: [embed], files: [currentLogo] };
};
