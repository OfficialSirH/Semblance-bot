import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { mementoMori } from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const embed = new Embed()
    .setTitle('Memento Mori')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setColor(randomColor)
    .setImage(mementoMori.name)
    .setDescription('[The Goodbye](https://www.youtube.com/watch?v=aDQ3nfBbPWM)');
  return { embeds: [embed], files: [mementoMori], ephemeral: true };
};
