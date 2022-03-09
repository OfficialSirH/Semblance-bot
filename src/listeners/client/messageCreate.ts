import { Events, Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { c2sGuildId, ignoredGuilds } from '#config';
import { createBoosterRewards } from '#constants/models';

export default class MessageCreate extends Listener<typeof Events.MessageCreate> {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.MessageCreate,
    });
  }

  public override async run(message: Message) {
    if (message.channel.type == 'DM') return;
    if (ignoredGuilds.includes(message.guild.id) ?? message.author.bot) return;

    if (
      message.guild.id == c2sGuildId &&
      message.channel.name == 'booster-chat' &&
      message.type == 'USER_PREMIUM_GUILD_SUBSCRIPTION'
    )
      return createBoosterRewards(message.client, message);
  }
}
