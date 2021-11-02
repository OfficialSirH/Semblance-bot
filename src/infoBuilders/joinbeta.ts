import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { Information } from '#models/Information';
import { MessageEmbed } from 'discord.js';
import config from '#config';

export const build: QueriedInfoBuilder = async interaction => {
  const { currentLogo } = config;
  const infoHandler = await Information.findOne({ infoType: 'joinbeta' });
  const embed = new MessageEmbed()
    .setTitle('Steps to join beta')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setFooter(`Called by ${interaction.user.tag}`)
    .setDescription(infoHandler.info);
  return { embeds: [embed], files: [currentLogo] };
};
