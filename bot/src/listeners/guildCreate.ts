import { isProduction } from '#constants/index';
import { request } from 'undici';
import { Listener } from '#structures/Listener';
import {
  ActivityType,
  GatewayDispatchEvents,
  type GatewayGuildCreateDispatchData,
  GatewayOpcodes,
  PresenceUpdateStatus,
} from '@discordjs/core';

export default class GuildCreate extends Listener<GatewayDispatchEvents.GuildCreate> {
  public constructor(client: Listener.Requirement) {
    super(client, {
      event: GatewayDispatchEvents.GuildCreate,
    });
  }

  public override async run(guild: GatewayGuildCreateDispatchData) {
    this.client.cache.data.guilds.set(guild.id, guild);
    const guilds = this.client.cache.data.guilds;
    if (guilds.size % 10 != 0 || !isProduction) return;

    const totalMembers = guilds
      .map(g => g.approximate_member_count)
      .filter(g => g)
      .reduce<number>((total, cur) => (total += cur || 0), 0);
    const activity = `help in ${guilds.size} servers | ${totalMembers} members`;
    this.client.ws.send(0, {
      op: GatewayOpcodes.PresenceUpdate,
      d: {
        activities: [
          {
            name: activity,
            type: ActivityType.Watching,
          },
        ],
        afk: false,
        since: null,
        status: PresenceUpdateStatus.Online,
      },
    });

    const res = (await request(`${process.env.BOT_LISTING_HANDLER_URL}/update`, {
      method: 'POST',
      headers: {
        Authorization: process.env.BOT_LISTING_AUTH,
      },
      body: JSON.stringify({
        guild_count: guilds.size,
        shard_count: (await this.client.ws.getShardCount()) ?? 0,
        shard_id: (await this.client.ws.getShardIds())[0] ?? 0,
        user_count: totalMembers,
      }),
    }).then(res => res.body.json().catch(() => null))) as { success: boolean } | null;

    if (res?.success) this.client.logger.info(`Updated bot list data for ${this.client.user?.username}`);
    else this.client.logger.error(`Failed to update bot list data for ${this.client.user?.username}`);
  }
}
