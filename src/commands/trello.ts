import { MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import type { Command } from '@semblance/lib/interfaces/Semblance';

export default {
  description: "Provides link to Semblance's Trello Board",
  category: 'semblance',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => {
    let embed = new MessageEmbed()
    .setDescription("[Semblance's Trello board](https://trello.com/b/Zhrs5AaN/semblance-project)")
    .setColor(randomColor);
    message.channel.send({ embeds: [embed] });
  }
} as Command<'semblance'>;
