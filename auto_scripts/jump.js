const { MessageEmbed, Collection, Util } = require('discord.js'), { parseArgs } = require('../constants'),
    limitedJump = new Collection(), discordDefault = "https://discordapp.com/channels/",
    sweepJump = setInterval(() => limitedJump.sweep((item) => true, 30000)),
    JTModel = require('../models/Jump.js');

module.exports = {
    description: "Converts message links to an embed",
    usage: {
        "<MsgLink>":""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    if (limitedJump.has(message.id)) {
        var theMsg = limitedJump.get(message.id);
        if (limitedJump.get(message.id) == 2) {
            sendMessages(client, message, limitedJump.get(message.id), content);
            return limitedJump.delete(message.id);
        } else limitedJump.set(message.id, theMsg + 1);
    } else {
        var jumpHandler = await JTModel.findOne({ guild: message.guild.id });
        if (!jumpHandler || !jumpHandler.active) return;
        limitedJump.set(message.id, 1);
    }
    
    var content = args.join(" ");

    if (content.indexOf('https://') == -1 || (content.indexOf('discord.com/channels/') == -1 && content.indexOf(discordDefault) == -1)) {
        if (limitedJump.get(message.id) > 1) sendMessages(client, message, limitedJump.get(message.id), content);
        return limitedJump.delete(message.id);
    }
    if (content.indexOf(discordDefault) == -1) content = content.replace(content.substring(content.indexOf('https://'), content.indexOf('discord.com/channels/') +'discord.com/channels/'.length), discordDefault);
    

    var guildID = content.substring(content.indexOf(discordDefault) + discordDefault.length, content.indexOf('/', content.indexOf(discordDefault) + discordDefault.length));
    var channelID = content.substring(content.indexOf(guildID) + guildID.length + 1, content.indexOf('/', content.indexOf(guildID) + guildID.length + 1));
    var messageID = content.substring(content.indexOf(channelID) + channelID.length + 1).match(/\d\S/g).join('');
        client.guilds.fetch(guildID).then(guild => {
            var channel = guild.channels.cache.get(channelID);
            if (channel.nsfw || guild.id != message.guild.id) {
                if (limitedJump.get(message.id) > 1) sendMessages(client, message, limitedJump.get(message.id), content);
                return limitedJump.delete(message.id);
            }
            channel.messages.fetch(messageID).then(async (msg) => {
                var embed = new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL())
                    .setThumbnail(message.author.displayAvatarURL())
                    .setDescription(msg.content)
                    .addField('Jump', `[Go to message!](${msg.url})`)
                    .setFooter(`#${msg.channel.name} quoted by ${message.author.tag}`)
                    .setTimestamp(msg.createdTimestamp);
                if (msg.embeds[0]) {
                    var title = (msg.embeds[0].title) ? msg.embeds[0].title : 'no title',
                        description = (msg.embeds[0].description) ? msg.embeds[0].description : 'no description';
                    embed.addField(`Embed: ${title}`, `Description: ${description}`);
                    if (msg.embeds[0].image) embed.setImage(msg.embeds[0].image.url);
                }
                if (msg.attachments && !embed.image) embed.setImage(msg.attachments.map(a => a.url).filter((item, ind) => item)[0]);
                /*var theMsg = await limitedJump.get(message.id);
                theMsg.push(embed);*/
                message.channel.send(embed).then(m => message.delete().catch(err => err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    content = content.replace(`https://discordapp.com/channels/${guildID}/${channelID}/${messageID}`, ``);
    args = parseArgs(content);
    if (limitedJump.get(message.id) >= 2) {
        sendMessages(client, message, limitedJump.get(message.id), content);
        return limitedJump.delete(message.id);
    }
    else module.exports.run(client, message, args);
}

async function sendMessages(client, message, embeds, content) {
    //for (var embed in embeds) message.channel.send(embed);
    message.channel.send(Util.removeMentions(content));
}

