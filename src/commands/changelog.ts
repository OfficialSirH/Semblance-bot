import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import { Information } from '#models/Information';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'Provides the latest changes to Semblance.',
  category: 'semblance',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'semblance'>;

const run = async (message: Message) => {
  let changelogHandler = await Information.findOne({ infoType: 'changelog' });
  let embed = new MessageEmbed()
    .setTitle('Changelog')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor)
    .setDescription(changelogHandler.info);
  message.channel.send({ embeds: [embed] });
};
