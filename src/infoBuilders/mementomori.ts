import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';
import config from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const { mementoMori } = config;
  const embed = new MessageEmbed()
    .setTitle('Memento Mori')
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setColor(randomColor)
    .setImage(mementoMori.name)
    .setDescription('[The Goodbye](https://www.youtube.com/watch?v=aDQ3nfBbPWM)');
  return { embeds: [embed], files: [mementoMori], ephemeral: true };
};
