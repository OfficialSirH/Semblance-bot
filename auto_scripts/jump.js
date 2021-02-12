const { MessageEmbed, Collection, Util } = require('discord.js'), { parseArgs } = require('../constants'),
    JTModel = require('../models/Jump.js');

module.exports = {
    description: "Converts message links to an embed",
    usage: {
        "<MsgLink>":""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args, recursiveCount = 0) => {
    const jumpHandler = await JTModel.findOne({ guild: message.guild.id });
    if (recursiveCount == 2) return message.delete();
    if (!jumpHandler || !jumpHandler.active) return;
    
    let content = args.join(" ");

    const link = /https?:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/channels\/(?<guildID>@me|\d{17,19})?\/(?<channelID>\d{17,20})\/(?<messageID>\d{17,20})/.exec(content);
    if (link == null) return recursiveCount > 0 ? message.delete() : undefined; 
    const { groups: { guildID, channelID, messageID } } = link;

    client.guilds.fetch(guildID).then(guild => {
        let channel = guild.channels.cache.get(channelID);
        if (channel.nsfw || guild.id != message.guild.id) return;

        channel.messages.fetch(messageID).then(async (msg) => {
            let attachmentLink = /https?:\/\/(?:cdn\.)?discord(?:app)?\.com\/attachments\/\d{17,19}\/\d{17,20}\/(?<name>\w*)(?:\.png|\.jpg|\.jpeg|\.webp|\.gif)/i.exec(msg.content);
            msg.content = msg.content.replace(/https?:\/\/(?:cdn\.)?discord(?:app)?\.com\/attachments\/\d{17,19}\/\d{17,20}\/\w*(?:\.png|\.jpg|\.jpeg|\.webp|\.gif)/i.exec(msg.content)[0], ``);

            let embed = new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL())
                .setThumbnail(message.author.displayAvatarURL())
                .setDescription(msg.content)
                .addField('Jump', `[Go to message!](${msg.url})`)
                .setFooter(`#${msg.channel.name} quoted by ${message.author.tag}`)
                .setTimestamp(msg.createdTimestamp);
            if (msg.embeds[0] && attachmentLink == null) {
                let title = (msg.embeds[0].title) ? msg.embeds[0].title : 'no title',
                    description = (msg.embeds[0].description) ? msg.embeds[0].description : 'no description';
                embed.addField(`Embed: ${title}`, `Description: ${description}`);
                if (msg.embeds[0].image) embed.setImage(msg.embeds[0].image.url);
            }

            if (embed.image == null && (msg.attachments.size > 0 || attachmentLink != null))
            embed.setImage(msg.attachments.size > 0 ? msg.attachments.map(a => a.url).filter((item, ind) => item)[0] : attachmentLink[0]);
            
            message.channel.send(embed);

            content = content.replace(/https?:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/channels\/(?:@me|\d{17,19}\/)?\d{17,20}\/\d{17,20}/.exec(content)[0], ``);
            args = parseArgs(content);

            module.exports.run(client, message, args, ++recursiveCount);
        
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}