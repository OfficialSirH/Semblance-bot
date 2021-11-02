import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';

export const build: QueriedInfoBuilder = () => {
  const embed = new MessageEmbed()
    .setDescription("[Semblance's Trello board](https://trello.com/b/Zhrs5AaN/semblance-project)")
    .setColor(randomColor);
  return { embeds: [embed] };
};
