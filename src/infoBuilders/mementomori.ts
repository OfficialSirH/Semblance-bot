import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { mementoMori } from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const embed = new Embed()
    .setTitle('Memento Mori')
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setColor(randomColor)
    .setImage(mementoMori.name)
    .setDescription('[The Goodbye](https://www.youtube.com/watch?v=aDQ3nfBbPWM)');
  return { embeds: [embed], files: [mementoMori], ephemeral: true };
};
