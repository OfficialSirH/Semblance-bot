import type { FastifyReply, FastifyRequest } from 'fastify';
import { DBLApi, DBotsApi } from './structures';
import { Api as TopggApi } from '@top-gg/sdk';

export const updateBotData = async (
  req: FastifyRequest<{ Body: { guild_count: number; shard_count: number; shard_id: number; user_count: number } }>,
  rep: FastifyReply,
) => {
  const topggApi = new TopggApi(process.env.topGGAuth),
    dblApi = new DBLApi(process.env.discordBotListAuth),
    dbotsApi = new DBotsApi(process.env.discordBotsGGAuth);

  topggApi.postStats({
    serverCount: req.body.guild_count,
    shardId: req.body.shard_id,
    shardCount: req.body.shard_count,
  });

  dblApi.postStats({
    users: req.body.user_count,
    guilds: req.body.guild_count,
    shard_id: req.body.shard_id,
  });

  dbotsApi.postStats({
    guildCount: req.body.guild_count,
    shardCount: req.body.shard_count,
  });

  rep.status(200).send({ success: true });
};
