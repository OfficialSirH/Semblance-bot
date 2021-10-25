import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import config from '#config';
import type { Command } from '#lib/interfaces/Semblance';
const { currentLogo } = config;

export default {
  description: 'info on rebooting your in-game simulation',
  category: 'game',
  subcategory: 'main',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'game'>;

const run = async (message: Message) => {
  let embed = new MessageEmbed()
    .setTitle('Reboot')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(
      '**Reboot\'s location:** You can find the "Simulation Reboot" by  clicking on the (metabit) bar under your currency (entropy/ideas).\n' +
        '**The importance of rebooting your simulation:** you gain metabits from your stimulation, which in order to use them and unlock their potential you need to reboot your stimulation.' +
        'rebooting also offers a lot of speed boost and rewards',
    );
  message.channel.send({ embeds: [embed], files: [currentLogo] });
};
