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
        let theMsg = limitedJump.get(message.id);
        if (limitedJump.get(message.id) == 2) {
            return limitedJump.delete(message.id);
        } else limitedJump.set(message.id, theMsg + 1);
    } else {
        const jumpHandler = await JTModel.findOne({ guild: message.guild.id });
        if (!jumpHandler || !jumpHandler.active) return;
        limitedJump.set(message.id, 1);
    }
    
    let content = args.join(" ");
    
    const link = /https?:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/channels\/(?<guildID>@me|\d{17,19})?\/(?<channelID>\d{17,20})\/(?<messageID>\d{17,20})/.exec(content);
    if (link == null) return;
    const { groups: { guildID, channelID, messageID } } = link;

    client.guilds.fetch(guildID).then(guild => {
        let channel = guild.channels.cache.get(channelID);
        if (channel.nsfw || guild.id != message.guild.id) {
            return limitedJump.delete(message.id);
        }
        channel.messages.fetch(messageID).then(async (msg) => {
            let embed = new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL())
                .setThumbnail(message.author.displayAvatarURL())
                .setDescription(msg.content)
                .addField('Jump', `[Go to message!](${msg.url})`)
                .setFooter(`#${msg.channel.name} quoted by ${message.author.tag}`)
                .setTimestamp(msg.createdTimestamp);
            if (msg.embeds[0]) {
                let title = (msg.embeds[0].title) ? msg.embeds[0].title : 'no title',
                    description = (msg.embeds[0].description) ? msg.embeds[0].description : 'no description';
                embed.addField(`Embed: ${title}`, `Description: ${description}`);
                if (msg.embeds[0].image) embed.setImage(msg.embeds[0].image.url);
            }
            if (msg.attachments && !embed.image) embed.setImage(msg.attachments.map(a => a.url).filter((item, ind) => item)[0]);

            message.channel.send(embed).then(async m => {
                if (limitedJump.get(message.id) >= 2) await m.edit(Util.removeMentions(content), { embed: embed });
                await message.delete().catch(err => err);
            });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
content = content.replace(`https://discordapp.com/channels/${guildID}/${channelID}/${messageID}`, ``);
args = parseArgs(content);
if (limitedJump.get(message.id) >= 2) {
    return limitedJump.delete(message.id);
}
else module.exports.run(client, message, args);
}

