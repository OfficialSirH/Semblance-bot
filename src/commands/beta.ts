import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import config from '#config';
import { randomColor } from '#constants/index';
import { Information } from '#models/Information';
import type { Command } from '#lib/interfaces/Semblance';
const { currentLogo } = config;

export default {
  description: 'Get info on the latest beta.',
  category: 'game',
  subcategory: 'other',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'game'>;

const run = async (message: Message) => {
  const infoHandler = await Information.findOne({ infoType: 'beta' });
  const embed = new MessageEmbed()
    .setTitle('Beta')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(infoHandler.info)
    .setFooter('New stuff do be epicc');
  message.channel.send({ embeds: [embed], files: [currentLogo] });
};
