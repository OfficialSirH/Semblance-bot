import { Embed } from 'discord.js';
import { randomColor } from '#constants/index';
import { Command } from '@sapphire/framework';

export default {
  description: "Provides link to Semblance's Trello Board",
  category: 'semblance',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => {
    const embed = new Embed()
      .setDescription("[Semblance's Trello board](https://trello.com/b/Zhrs5AaN/semblance-project)")
      .setColor(randomColor);
    message.channel.send({ embeds: [embed] });
  },
} as Command<'semblance'>;
