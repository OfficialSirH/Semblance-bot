const { MessageEmbed, Util } = require('discord.js');

module.exports = {
    description: "Make announcements through Semblance",
    usage: {
        "<'!ar' for anonymous msg> <channel> <msg>": ""
    },
    permissionRequired: 1,
    checkArgs: (args) => args.length >= 2
}

module.exports.run = async (client, message, args) => {
    message.delete();
    if (args.length == 0) return message.reply('This command is used by doing s!say #MentionChannel <message> and if you place \'embed\' at the end of your message, your message will be embedded.');
    if (!message.mentions) {
        var channel = message.guild.channels.cache.get(args[0].substring(0, args[0].length));
    } else var channel = message.mentions.channels.first();
    if (!channel) {
        var channel = message.guild.channels.cache.get(args[0].substring(2, args[0].length - 1));
        if (!channel) return message.reply('Your specified channel was invalid.');
    }
    if (!message.guild.channels.cache.get(channel.id)) return message.reply('Don\'t be using channels from other servers, that\'s not allowed.');
    args.splice(args.indexOf(`<#${channel.id}>`), 1);
    var announcement = (message.member.hasPermission("MENTION_EVERYONE")) ? args.join(' ') : Util.removeMentions(args.join(' '));
    if (args[args.length - 1] == 'embed') return sendEmbedAnnouncement(client, channel, announcement, message);
    else if (message.attachments.size > 0) {
        if (!announcement.startsWith("!ar")) announcement += `\n- ${message.author.username}`;
        announcement = announcement.replace(/!ar/, '');
        channel.send(announcement, { files: [message.attachments.map(a => a.url)[0]] })
            .catch(err => message.reply("Something went wrong with the message, you might've typed too many characters.").then(msg => msg.delete({ timeout: 5000 })));
    }
    else {
        if (!announcement.startsWith("!ar")) announcement += `\n- ${message.author.username}`;
        announcement = announcement.replace(/!ar/, '');
        channel.send(announcement)
            .catch(err => message.reply("Something went wrong with the message, you might've typed too many characters.").then(msg => msg.delete({ timeout: 5000 })));
    }
}

async function sendEmbedAnnouncement(client, channel, announcement, message) {
    announcement = announcement.substring(0, announcement.lastIndexOf('embed'));
    var embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(announcement);
    if (message.attachments.size > 0) embed.setImage(message.attachments.map(a => a.url)[0]);
    channel.send(embed)
        .catch(err => message.reply("Something went wrong with the message, you might've typed too many characters.").then(msg => msg.delete({ timeout: 5000 })));
}
