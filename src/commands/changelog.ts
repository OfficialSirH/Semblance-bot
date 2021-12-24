import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import type { Command } from '#lib/interfaces/Semblance';
import type { Semblance } from '#src/structures/Semblance';

export default {
  description: 'Provides the latest changes to Semblance.',
  category: 'semblance',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'semblance'>;

const run = async (client: Semblance, message: Message) => {
  const changelogHandler = await client.db.information.findUnique({ where: { type: 'changelog' } });
  const embed = new MessageEmbed()
    .setTitle('Changelog')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor)
    .setDescription(changelogHandler.value);
  message.channel.send({ embeds: [embed] });
};
