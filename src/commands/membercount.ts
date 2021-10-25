import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'Provides the number of members in the server.',
  category: 'server',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'server'>;

const run = async (message: Message) => {
  let guild = await message.guild.fetch();
  let embed = new MessageEmbed()
    .setTitle('Members')
    .setColor(randomColor)
    .setDescription(guild.approximateMemberCount.toString())
    .setFooter(`Called upon by ${message.author.tag}`);
  message.channel.send({ embeds: [embed] });
};
