import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import config from '#config';
import type { Command } from '#lib/interfaces/Semblance';
const { geodeImage, currentLogo } = config;

export default {
  description: 'Get geode comparisons to show the best value.',
  category: 'game',
  subcategory: 'mesozoic',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'game'>;

const run = async (message: Message) => {
  const embed = new MessageEmbed()
    .setTitle('Geodes Comparison')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setThumbnail(currentLogo.name)
    .setImage(geodeImage.name)
    .setDescription(
      'The top row of the image represents the rewards from each geode at rank 50, ' +
        'while the bottom row represents the geode rewards at rank 4, ' +
        'which rank 4 is shown instead of 1 because the diamond geode isn\'t unlocked until rank 4. ' +
        'By the shown results within this image, it\'s highly recommended to get geodes at rank 50 for the greatest rewards for the same price as rank 4.',
    )
    .setFooter('Diamond Geodes for da win!');
  message.channel.send({ embeds: [embed], files: [currentLogo, geodeImage] });
};
