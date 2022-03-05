import { Listener } from '@sapphire/framework';
import { ChannelType, Events, MessageType } from 'discord.js';
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
    if (message.channel.type == ChannelType.DM) return;
    if (ignoredGuilds.includes(message.guild.id) ?? message.author.bot) return;

    if (
      message.guild.id == c2sGuildId &&
      message.channel.name == 'booster-chat' &&
      message.type == MessageType.UserPremiumGuildSubscription
    )
      return createBoosterRewards(message.client, message);
  }
}
