import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor, msToTime } from '#constants/index';
import type { SapphireClient } from '@sapphire/framework';
import { Command } from '@sapphire/framework';

export default {
  description: "Check the bot's latency.",
  category: 'semblance',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'semblance'>;

const run = async (client: SapphireClient, message: Message) => {
  const uptime = Date.now() - client.readyTimestamp,
    duration = msToTime(uptime),
    responseTime = Date.now() - message.createdTimestamp,
    userAvatar = message.author.displayAvatarURL(),
    embed = new Embed()
      .setTitle('Latency')
      .setColor(randomColor)
      .setThumbnail(userAvatar)
      .setDescription(
        `**Bot Response Time:** \`${responseTime}ms\`\n **API**: \`${Math.round(
          client.ws.ping,
        )}ms\` \n **Bot Uptime:** \`${duration}\``,
      )
      .setFooter({ text: `Why do this to me ${message.author.tag}`, iconURL: userAvatar });
  message.channel.send({ embeds: [embed] });
};
