import { GuildId } from '#constants/index';
import { Listener } from '#structures/Listener';
import { GatewayDispatchEvents, type GatewayGuildCreateDispatchData } from '@discordjs/core';

export default class GuildCreate extends Listener<GatewayDispatchEvents.GuildCreate> {
  public constructor(client: Listener.Requirement) {
    super(client, {
      event: GatewayDispatchEvents.GuildCreate,
    });
  }

  public override async run(guild: GatewayGuildCreateDispatchData) {
    this.client.cache.data.guilds.set(guild.id, guild);

    if (guild.id === GuildId.cellToSingularity)
      for (const channel of guild.channels) {
        this.client.cache.data.cellsChannels.set(channel.id, channel);
      }
  }
}
