const { MessageEmbed, Util, MessageAttachment } = require('discord.js'),
    { attachmentLinkRegex } = require('../constants');

module.exports = {
    description: "Make announcements through Semblance",
    category: 'admin',
    usage: {
        "<'!ar' for anonymous msg> <channel> <msg>": ""
    },
    permissionRequired: 2,
    checkArgs: (args) => args.length >= 2
}

module.exports.run = async (client, message, args, identifier, { permissionLevel, content }) => {
    message.delete();
    let channel = !message.mentions ? message.channel : message.mentions.channels.first();
    if (!message.guild.channels.cache.get(channel.id)) return message.reply('Don\'t be using channels from other servers, that\'s not allowed.');
    args.splice(args.indexOf(`<#${channel.id}>`), 1);
    let announcement = permissionLevel >= 4 ? args.join(' ') : Util.removeMentions(args.join(' ')).replace(/@/g, '');

    let finalizedMessage = [announcement];
    if (message.attachments.size > 0) finalizedMessage.push(message.attachments.map(a => a)[0]);
    else if (!!attachmentLinkRegex.exec(content)) finalizedMessage.push(new MessageAttachment(attachmentLinkRegex.exec(content)[0]));
    
    if (args[args.length - 1] == 'embed') return sendEmbedAnnouncement(channel, announcement, message, !announcement.startsWith('!ar'));

    if (!announcement.startsWith("!ar"))  {
        announcement += `\n- ${message.author.tag}(${message.author.id})`;
        announcement = announcement.replace(/!ar/, '');
    }
    channel.send(...finalizedMessage)
        .catch(err => message.reply("Something went wrong with the message, you might've typed too many characters.").then(msg => setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000)));
}

async function sendEmbedAnnouncement(channel, announcement, message, identity) {
    announcement = announcement.substring(0, announcement.lastIndexOf('embed'));

    let embed = new MessageEmbed().setDescription(announcement);

    if (message.attachments.size > 0) embed.setImage(message.attachments.map(a => a.url)[0]);
    else if (!!attachmentLinkRegex.exec(content)) embed.setImage(new MessageAttachment(attachmentLinkRegex.exec(content)[0]));

    if (identity) embed.setAuthor(message.author.tag, message.author.displayAvatarURL());

    channel.send(embed)
        .catch(err => message.reply("Something went wrong with the message, you might've typed too many characters.").then(msg => setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000)));
}
