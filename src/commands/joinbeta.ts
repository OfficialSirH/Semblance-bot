import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import config from '#config';
import { Information } from '#models/Information';
import type { Command } from '#lib/interfaces/Semblance';
const { currentLogo } = config;

export default {
  description: 'Info on how to become a beta tester',
  category: 'game',
  subcategory: 'other',
  aliases: ['betajoin', 'betaform'],
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'game'>;

const run = async (message: Message) => {
  const infoHandler = await Information.findOne({ infoType: 'joinbeta' });
  const embed = new MessageEmbed()
    .setTitle('Steps to join beta')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setFooter(`Called by ${message.author.tag}`)
    .setDescription(infoHandler.info);
  message.channel.send({ embeds: [embed], files: [currentLogo] });
};
