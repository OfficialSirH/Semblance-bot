import { type Guild, ActivityType } from 'discord.js';
import { Api as TopggApi } from '@top-gg/sdk';
import { DBLApi, DBotsApi } from './structures';
import { isProduction } from './constants.js';

export const guildCreate = (guild: Guild) => {
  const client = guild.client;
  if (client.guilds.cache.size % 10 != 0 || !isProduction) return;

  const totalMembers = client.guilds.cache
    .map(g => g.memberCount)
    .filter(g => g)
    .reduce((total, cur) => (total += cur), 0);
  const activity = `help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
  if (client.user.presence.activities[0]?.name !== activity)
    client.user.setActivity(activity, { type: ActivityType.Watching });

  const topggApi = new TopggApi(process.env.topGGAuth),
    dblApi = new DBLApi(process.env.discordBotListAuth),
    dbotsApi = new DBotsApi(process.env.discordBotsGGAuth);

  topggApi.postStats({
    serverCount: client.guilds.cache.size,
    shardId: client.shard?.ids?.at(0),
    shardCount: client.options.shardCount,
  });

  dblApi.postStats({
    users: client.guilds.cache.reduce((acc, cur) => (acc += cur.memberCount), 0),
    guilds: client.guilds.cache.size,
    shard_id: client.shard?.ids?.at(0),
  });

  dbotsApi.postStats({
    guildCount: client.guilds.cache.size,
    shardCount: client.options.shardCount || 0,
  });
};
