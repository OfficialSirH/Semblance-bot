import { Embed } from 'discord.js';
import { randomColor } from '#constants/index';
import { currentLogo, trexBadge } from '#config';
import { Command } from '@sapphire/framework';

export default {
  description: 'T-Rex info',
  category: 'game',
  subcategory: 'mesozoic',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => {
    const embed = new Embed()
      .setTitle(`${trexBadge}Tyrannosaurus Rex`)
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setDescription(
        'The T-Rex, the rightful king of the Mesozoic Valley, can be unlocked at Rank 26 in the Mesozoic Valley, which will also earn you an achievement called, "Birth of a Tyrant".',
      );
    message.channel.send({ embeds: [embed], files: [currentLogo] });
  },
} as Command<'game'>;
