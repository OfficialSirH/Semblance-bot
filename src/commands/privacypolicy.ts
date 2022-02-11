import { Embed } from 'discord.js';
import { randomColor } from '#constants/index';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: "Provides link to Semblance's Privacy Policy",
  category: 'semblance',
  aliases: ['pp', 'privacy', 'policy'],
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => {
    const embed = new Embed()
      .setTitle('Privacy Policy')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor(randomColor)
      .setURL('https://github.com/OfficialSirH/Semblance-bot/blob/master/Privacy%20Policy.md');
    message.channel.send({ embeds: [embed] });
  },
} as Command<'semblance'>;
