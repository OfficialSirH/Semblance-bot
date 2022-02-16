import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';

export const build: QueriedInfoBuilder = () => {
  const embed = new Embed()
    .setDescription("[Semblance's Trello board](https://trello.com/b/Zhrs5AaN/semblance-project)")
    .setColor(randomColor);
  return { embeds: [embed] };
};
