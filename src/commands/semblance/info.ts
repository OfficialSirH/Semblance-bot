import { type Message, MessageEmbed, version } from 'discord.js';
import { randomColor, msToTime, Category, emojis } from '#constants/index';
import { Command } from '@sapphire/framework';
import { release } from 'os';

export default class Info extends Command {
  public override name = 'info';
  public override description = 'Provides information about Semblance.';
  public override fullCategory = [Category.semblance];

  public override async sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const { client } = builder;
    const uptime = Date.now() - client.readyTimestamp;
    const duration = msToTime(uptime);
    const responseTime = Date.now() - builder.createdTimestamp;
    const totalMembers = client.guilds.cache.reduce((total, cur) => (total += cur.memberCount), 0);
    const usage = Math.round((process.memoryUsage().heapUsed / Math.pow(1024, 2)) * 100) / 100;
    const percentageUsed = Math.round((usage / 1000) * 10000) / 100;

    let guilds: number, users: number, shardCount: number;
    if (client.shard) {
      guilds = await client.shard
        .broadcastEval(eclient => eclient.guilds.cache.size)
        .then(res => res.reduce((prev, val) => prev + val, 0));
      users = await client.shard
        .broadcastEval(eclient => eclient.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b))
        .then(res => res.reduce((prev, val) => prev + val, 0));
      shardCount = client.shard.count;
    } else {
      guilds = client.guilds.cache.size;
      users = client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b);
      shardCount = 0;
    }

    const embed = new MessageEmbed()
      .setTitle(`Bot Information - ${client.user.tag}`)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        {
          name: `${emojis.singularity} Host`,
          value: [
            `**OS:** \`Ubuntu ${release()}\``,
            `**Library:** \`discord.js${version}\``,
            `**Memory Usage:** \`${usage} MB (${percentageUsed}%)\``,
          ].join('\n'),
          inline: true,
        },

        {
          name: `${emojis.entropy} Stats`,
          value: [
            `**Guilds:** \`${guilds}\``,
            `**Members:** \`${totalMembers}\``,
            `**Shard Count:** \`${shardCount}\``,
          ].join('\n'),
          inline: true,
        },

        {
          name: `${emojis.idea} Runtime`,
          value: [
            `**Bot Response:** \`${responseTime} ms\``,
            `**API Response:** \`${client.ws.ping} ms\``,
            `**Uptime:** \`${duration}\``,
          ].join('\n'),
          inline: true,
        },
      )
      .setFooter({ text: 'The all powerful Semblance has spoken!' });

    if (client.shard)
      embed.addFields({
        name: `${emojis.metabit} This Shard (${builder.guild.shardId})`,
        value: `**Guilds:** ${guilds}\n` + `**Users:** ${users}`,
      });

    embed.addFields({
      name: `${emojis.mutagen} Links`,
      value: [
        `- [Semblance Invite](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=274878295040&scope=bot+applications.commands)`,
        '- [Semblance Support/Main](https://discord.gg/XFMaTn6taf)',
        '- [Cell to Singularity](https://discord.gg/celltosingularity)',
      ].join('\n'),
      inline: true,
    });
    return { embeds: [embed] };
  }

  public override async messageRun(message: Message) {
    await message.reply(await this.sharedRun(message));
  }
}
