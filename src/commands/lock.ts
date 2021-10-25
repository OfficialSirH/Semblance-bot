import * as constants from '#constants/index';
import config from '#config';
import type { Collection, Message, GuildChannel, ThreadChannel, TextChannel, User } from 'discord.js';
import type { Command } from '#lib/interfaces/Semblance';
const { c2sGuildId, sirhGuildId } = config;

export default {
  description: 'Lock the current channel, or all the public channels.',
  category: 'admin',
  permissionRequired: 2,
  checkArgs: args => {
    if (args[0] == '-public' && args.length == 1) return true;
    if (!args.length) return true;
    return false;
  },
  run: (_client, message, args) => run(message, args),
} as Command<'admin'>;

const run = async (message: Message, args: string[]) => {
  if (args[0] == '-public') {
    let channels: Collection<string, GuildChannel | ThreadChannel>;
    if (message.guild.id == c2sGuildId) {
      channels = message.guild.channels.cache.filter(ch => constants.cellChannels.includes(ch.id));
    } else if (message.guild.id == sirhGuildId) {
      channels = message.guild.channels.cache.filter(ch => constants.sirhChannels.includes(ch.id));
    }
    if (!channels.size)
      return message.channel.send(`🚫 This server doesnt have any public channels configured, unfortunately.`);
    else channels.map(ch => lockChannel(ch as TextChannel, message.author));
  } else {
    let success = await lockChannel(message.channel as TextChannel, message.author);
    if (success) message.delete();
    else message.channel.send(`🚫 This channel is already locked!`);
  }
};

async function lockChannel(channel: TextChannel, author: User) {
  let permission = channel.permissionOverwrites.cache.find(po => po.id == channel.guild.roles.everyone.id);
  if (permission.deny.has('SEND_MESSAGES')) return false;

  await channel.edit({ topic: `${channel.topic || ''}\n\n${constants.lockMessage(author)}` });
  await permission.edit({ SEND_MESSAGES: false });
  await channel.send(`👮 ***The channel has been locked.***`);
  return true;
}
