import * as constants from '@semblance/constants';
import { Collection, GuildChannel, ThreadChannel, Message, TextChannel, User } from 'discord.js';
import { Semblance } from '../structures';
import config from '@semblance/config';
const { c2sGuildId, sirhGuildId } = config;

module.exports = {
    description: "Unlock the current channel, or all the public channels.",
    category: 'admin',
    usage: {},
    examples: {},
    aliases: [],
    permissionRequired: 2,
    checkArgs: (args: string[]) => {
        if (args[0] == "-public" && args.length == 1) return true;
        if (!args.length) return true;
        return false;
    }
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    if (args[0] == "-public") {
        let channels: Collection<string, GuildChannel | ThreadChannel>;
        if (message.guild.id == c2sGuildId) 
            channels = message.guild.channels.cache.filter(ch => constants.cellChannels.includes(ch.id));
        if (message.guild.id == sirhGuildId)
        channels = message.guild.channels.cache.filter(ch => constants.sirhChannels.includes(ch.id));
        if (!channels.size) return message.channel.send(`🚫 This server doesnt have any public channels configured, unfortunately.`)
        else channels.map(ch => unlockChannel(ch as TextChannel, message.author))
    } else {
        let success = await unlockChannel(message.channel as TextChannel, message.author)
        if (success) message.delete();
        else message.channel.send(`👮 This channel isn't locked!`)
    }
}

async function unlockChannel(channel: TextChannel, author: User) {
    let permission = channel.permissionOverwrites.cache.find(po => po.id == channel.guild.roles.everyone.id);
    if (!permission.deny.has("SEND_MESSAGES")) return false;

    await channel.edit({ topic: channel.topic.replace(constants.lockMessage(author), "") })
    await permission.edit({ "SEND_MESSAGES": null })
    await channel.send(`👮 ***The channel has been unlocked.***`)
    return true;
}