import type { EventHandler } from '#lib/interfaces/Semblance';
import type { SapphireClient } from '@sapphire/framework';
import { Api as TopggApi } from '@top-gg/sdk';
import { DBLApi, DBoatsApi, DBotsApi, DListApi, DiscordsApi } from '#structures/index';
import { Constants } from 'discord.js';
import { prefix } from '#src/constants';
const { Events } = Constants;

export default {
  name: Events.GUILD_CREATE,
  exec: (_guild, client) => guildCreate(client),
} as EventHandler<'guildCreate'>;

export const guildCreate = (client: SapphireClient) => {
  if (client.guilds.cache.size % 10 != 0) return;

  const totalMembers = client.guilds.cache
    .map(g => g.memberCount)
    .filter(g => g)
    .reduce((total, cur) => (total += cur), 0);
  const activity = `${prefix}help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
  if (client.user.presence.activities[0]?.name !== activity) client.user.setActivity(activity, { type: 'WATCHING' });

  const topggApi = new TopggApi(process.env.topGGAuth),
    dblApi = new DBLApi(process.env.discordBotListAuth),
    dboatsApi = new DBoatsApi(process.env.DBoatsAuth),
    dbotsApi = new DBotsApi(process.env.discordBotsGGAuth),
    dlistApi = new DListApi(process.env.botListSpaceAuth),
    discordsApi = new DiscordsApi(process.env.botsForDiscordAuth);

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

  dboatsApi.postStats(client.guilds.cache.size);

  dbotsApi.postStats({
    guildCount: client.guilds.cache.size,
    shardCount: client.options.shardCount,
  });

  dlistApi.postStats(client.guilds.cache.size);

  discordsApi.postStats(client.guilds.cache.size);
};
