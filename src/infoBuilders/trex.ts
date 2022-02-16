import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { trexBadge, currentLogo } from '#config';

export const build: QueriedInfoBuilder = () => {
  const embed = new Embed()
    .setTitle(`${trexBadge}Tyrannosaurus Rex`)
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(
      'The T-Rex, the rightful king of the Mesozoic Valley, can be unlocked at Rank 26 in the Mesozoic Valley, which will also earn you an achievement called, "Birth of a Tyrant".',
    );
  return { embeds: [embed], files: [currentLogo] };
};
