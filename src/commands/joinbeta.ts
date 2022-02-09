import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import { currentLogo } from '#config';
import type { Command } from '#lib/interfaces/Semblance';
import type { Semblance } from '#structures/Semblance';

export default {
  description: 'Info on how to become a beta tester',
  category: 'game',
  subcategory: 'other',
  aliases: ['betajoin', 'betaform'],
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'game'>;

const run = async (client: Semblance, message: Message) => {
  const infoHandler = await client.db.information.findUnique({ where: { type: 'joinbeta' } });
  const embed = new MessageEmbed()
    .setTitle('Steps to join beta')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setFooter({ text: `Called by ${message.author.tag}` })
    .setDescription(infoHandler.value);
  message.channel.send({ embeds: [embed], files: [currentLogo] });
};
