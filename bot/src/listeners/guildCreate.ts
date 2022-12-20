import { type Guild, ActivityType, Events } from 'discord.js';
import { isProduction } from '#constants/index';
import { request } from 'undici';
import { Listener } from '@sapphire/framework';

export default class GuildCreate extends Listener<typeof Events.GuildCreate> {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.GuildCreate,
    });
  }

  public override async run(guild: Guild) {
    const client = guild.client;
    if (client.guilds.cache.size % 10 != 0 || !isProduction) return;

    const totalMembers = client.guilds.cache
      .map(g => g.memberCount)
      .filter(g => g)
      .reduce((total, cur) => (total += cur), 0);
    const activity = `help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
    if (client.user.presence.activities[0]?.name !== activity)
      client.user.setActivity(activity, { type: ActivityType.Watching });

    const res = (await request(`${process.env.BOT_LISTING_HANDLER_URL}/update`, {
      method: 'POST',
      headers: {
        Authorization: process.env.BOT_LISTING_AUTH,
      },
      body: JSON.stringify({
        guild_count: client.guilds.cache.size,
        shard_count: client.shard?.count ?? 0,
        shard_id: client.shard?.ids[0] ?? 0,
        user_count: totalMembers,
      }),
    }).then(res => res.body.json().catch(() => null))) as { success: boolean } | null;

    if (res?.success) client.logger.info(`Updated bot list data for ${client.user.tag}`);
    else client.logger.error(`Failed to update bot list data for ${client.user.tag}`);
  }
}
