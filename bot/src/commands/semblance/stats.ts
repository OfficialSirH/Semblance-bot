import { randomColor, msToTime, Category, emojis, userTag, avatarUrl } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { APIChatInputApplicationCommandGuildInteraction, APIGuild } from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import { release, version } from 'os';

export default class Info extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'stats',
      description: 'Provides statistics about Semblance.',
      fullCategory: [Category.semblance],
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    const client = this.client;
    const uptime = Date.now() - client.readyTimestamp;
    const duration = msToTime(uptime);
    const createdTimestamp = Number(interaction.id) / 4194304 + 1420070400000;
    const responseTime = Date.now() - createdTimestamp;
    const totalMembers = client.cache.data.guilds.reduce(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (total, cur) => (total += (cur as APIGuild).approximate_member_count!),
      0,
    );
    const usage = Math.round((process.memoryUsage().heapUsed / Math.pow(1024, 2)) * 100) / 100;
    const percentageUsed = Math.round((usage / 1000) * 10000) / 100;

    // let guilds: number, users: number, shardCount: number;
    // if (client.shard) {
    //   guilds = await client.shard
    //     .broadcastEval(eclient => eclient.guilds.cache.size)
    //     .then(res => res.reduce((prev, val) => prev + val, 0));
    //   users = await client.shard
    //     .broadcastEval(eclient => eclient.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b))
    //     .then(res => res.reduce((prev, val) => prev + val, 0));
    //   shardCount = client.shard.count;
    // } else {
    //   guilds = client.guilds.cache.size;
    //   users = client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b);
    //   shardCount = 0;
    // }
    const guilds = client.cache.data.guilds.size;

    const embed = new EmbedBuilder()
      .setTitle(`Bot Information - ${userTag(client.user)}`)

      .setColor(randomColor)
      .setThumbnail(avatarUrl(client.user))
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
            // `**Shard Count:** \`${shardCount}\``,
          ].join('\n'),
          inline: true,
        },

        {
          name: `${emojis.idea} Runtime`,
          value: [
            `**Bot Response:** \`${responseTime} ms\``,
            // `**API Response:** \`${client.ws.ping} ms\``,
            `**Uptime:** \`${duration}\``,
          ].join('\n'),
          inline: true,
        },
      )
      .setFooter({ text: 'The all powerful Semblance has spoken!' });

    // if (client.shard)
    //   embed.addFields({
    //     name: `${emojis.metabit} This Shard (${interaction.guild?.shardId})`,
    //     value: `**Guilds:** ${guilds}\n` + `**Users:** ${users}`,
    //   });

    embed.addFields({
      name: `${emojis.mutagen} Links`,
      value: [
        `- [Semblance Invite](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=274878295040&scope=bot+applications.commands)`,
        '- [Semblance Support/Main](https://discord.gg/XFMaTn6taf)',
        '- [Cell to Singularity](https://discord.gg/celltosingularity)',
      ].join('\n'),
      inline: true,
    });
    this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
    };
  }
}
