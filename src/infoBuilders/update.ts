import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';
import { currentLogo } from '#config';

export const build: QueriedInfoBuilder = async (_, client) => {
  // const infoHandler = await Information.findOne({ infoType: 'update' });
  const infoHandler = await client.db.information.findUnique({ where: { type: 'update' } });
  const embed = new MessageEmbed()
    .setTitle('Steam and Mobile Updates')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(infoHandler.value);
  return { embeds: [embed], files: [currentLogo] };
};
