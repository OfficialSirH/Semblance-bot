import { MessageEmbed, version } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor, msToTime } from '#constants/index';
import config from '#config';
import type { Semblance } from '#structures/Semblance';
import type { Command } from '#lib/interfaces/Semblance';
const { singularity, entropy, metabit, mutagen, idea } = config;

export default {
  description: 'Get information about the epic bot, Semblance',
  category: 'semblance',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'semblance'>;

const run = async (client: Semblance, message: Message) => {
  let uptime = Date.now() - client.readyTimestamp;
  let duration = msToTime(uptime);
  let responseTime = Date.now() - message.createdTimestamp;
  let totalMembers = client.guilds.cache.reduce((total, cur) => (total += cur.memberCount), 0);
  const usage = Math.round((process.memoryUsage().heapUsed / Math.pow(1024, 2)) * 100) / 100;
  const percentageUsed = Math.round((usage / 1000) * 10000) / 100;
  let guilds: number, users: number, shardCount: number;
  if (message.client.shard) {
    guilds = await message.client.shard
      .broadcastEval((eclient: Semblance) => eclient.guilds.cache.size)
      .then(res => res.reduce((prev, val) => prev + val, 0));
    users = await message.client.shard
      .broadcastEval((eclient: Semblance) => eclient.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b))
      .then(res => res.reduce((prev, val) => prev + val, 0));
    shardCount = message.client.shard.count;
  } else {
    guilds = client.guilds.cache.size;
    users = client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b);
    shardCount = 0;
  }
  let embed = new MessageEmbed()
    .setTitle(`Bot Information - ${client.user.tag}`)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor)
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
      {
        name: `${singularity} Host`,
        value: [
          `**OS:** \`Ubuntu ${(await import('os')).release()}\``,
          `**Library:** \`discord.js${version}\``,
          `**Memory Usage:** \`${usage} MB (${percentageUsed}%)\``,
        ].join('\n'),
        inline: true,
      },

      {
        name: `${entropy} Stats`,
        value: [
          `**Guilds:** \`${guilds}\``,
          `**Members:** \`${totalMembers}\``,
          `**Shard Count:** \`${shardCount}\``,
        ].join('\n'),
        inline: true,
      },

      {
        name: `${idea} Runtime`,
        value: [
          `**Bot Response:** \`${responseTime} ms\``,
          `**API Response:** \`${client.ws.ping} ms\``,
          `**Uptime:** \`${duration}\``,
        ].join('\n'),
        inline: true,
      },
    )
    .setFooter('The all powerful Semblance has spoken!');

  if (client.shard)
    embed.addField(
      `${metabit} This Shard (${message.guild.shardId})`,
      `**Guilds:** ${guilds}\n` + `**Users:** ${users}`,
    );

  embed.addField(
    `${mutagen} Links`,
    [
      `- [Semblance Invite](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot+applications.commands)`,
      `- [Semblance Support/Main](https://discord.gg/XFMaTn6taf)`,
      `- [Cell to Singularity](https://discord.gg/celltosingularity)`,
    ].join('\n'),
    true,
  );
  message.channel.send({ embeds: [embed] });
};
