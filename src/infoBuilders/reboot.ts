import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';
import config from '#config';

export const build: QueriedInfoBuilder = () => {
  const { currentLogo } = config;
  const embed = new MessageEmbed()
    .setTitle('Reboot')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(
      '**Reboot\'s location:** You can find the "Simulation Reboot" by  clicking on the (metabit) bar under your currency (entropy/ideas).\n' +
        '**The importance of rebooting your simulation:** you gain metabits from your stimulation, which in order to use them and unlock their potential you need to reboot your stimulation.' +
        'rebooting also offers a lot of speed boost and rewards',
    );
  return { embeds: [embed], files: [currentLogo] };
};
