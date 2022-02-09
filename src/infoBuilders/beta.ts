import { currentLogo } from '#config';
import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';

export const build: QueriedInfoBuilder = async (_, client) => {
  const infoHandler = await client.db.information.findUnique({ where: { type: 'beta' } });
  const embed = new MessageEmbed()
    .setTitle('Beta')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(infoHandler.value)
    .setFooter({ text: 'New stuff do be epicc' });
  return { embeds: [embed], files: [currentLogo] };
};
