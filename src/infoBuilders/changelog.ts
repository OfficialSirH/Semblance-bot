import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { Information } from '#models/Information';
import { MessageEmbed } from 'discord.js';

export const build: QueriedInfoBuilder = async interaction => {
  const changelogHandler = await Information.findOne({ infoType: 'changelog' });
  const embed = new MessageEmbed()
    .setTitle('Changelog')
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setColor(randomColor)
    .setDescription(changelogHandler.info);
  return { embeds: [embed] };
};
