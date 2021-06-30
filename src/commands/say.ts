import { Message, MessageEmbed, Util, MessageAttachment, TextChannel } from "discord.js";
import { Semblance } from "../structures";
import { attachmentLinkRegex } from '@semblance/constants';

module.exports = {
    description: "Make announcements through Semblance",
    category: 'admin',
    usage: {
        "<'!ar' for anonymous msg> <channel> <msg>": ""
    },
    permissionRequired: 2,
    checkArgs: (args: string[]) => args.length >= 2
}

module.exports.run = async (client: Semblance, message: Message, args: string[], identifier: string, { permissionLevel, content }) => {
    message.delete();
    let channel = !message.mentions ? message.channel : message.mentions.channels.first() as TextChannel;
    if (!message.guild.channels.cache.has(channel.id)) return message.reply('Don\'t be using channels from other servers, that\'s not allowed.');
    args.splice(args.indexOf(`<#${channel.id}>`), 1);
    let announcement = permissionLevel >= 4 ? args.join(' ') : Util.removeMentions(args.join(' ')).replace(/@/g, '');

    let messageOptions = {
        content: announcement,
        files: []
    };
    if (message.attachments.size > 0) messageOptions.files.push(message.attachments.map(a => a)[0]);
    else if (!!attachmentLinkRegex.exec(content)) messageOptions.files.push(attachmentLinkRegex.exec(content)[0]);
    
    if (args[args.length - 1] == 'embed') return sendEmbedAnnouncement(channel as TextChannel, message, announcement, !announcement.startsWith('!ar'));

    if (!announcement.startsWith("!ar"))  {
        announcement += `\n- ${message.author.tag}(${message.author.id})`;
        announcement = announcement.replace(/!ar/, '');
    }
    if (announcement.length > 2000) return message.reply('Your input was too long');
    channel.send(messageOptions)
        .catch(() => message.reply("Something went wrong with the message, you might've typed too many characters.").then(msg => setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000)));
}

async function sendEmbedAnnouncement(channel: TextChannel, message: Message, announcement: string, identity: boolean) {
    announcement = announcement.substring(0, announcement.lastIndexOf('embed'));

    let embed = new MessageEmbed().setDescription(announcement);

    if (message.attachments.size > 0) embed.setImage(message.attachments.map(a => a.url)[0]);
    else if (!!attachmentLinkRegex.exec(announcement)) embed.setImage(attachmentLinkRegex.exec(announcement)[0]);

    if (identity) embed.setAuthor(message.author.tag, message.author.displayAvatarURL());

    channel.send({ embeds:[embed] })
        .catch(() => message.reply("Something went wrong with the message, you might've typed too many characters.").then(msg => setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000)));
}
