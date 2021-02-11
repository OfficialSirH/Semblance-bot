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
    if (!jumpHandler || !jumpHandler.active || recursiveCount == 2) return;
    
    let content = args.join(" ");
    
    const link = /https?:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/channels\/(?<guildID>@me|\d{17,19})?\/(?<channelID>\d{17,20})\/(?<messageID>\d{17,20})/.exec(content);
    if (link == null) return; 
    const { groups: { guildID, channelID, messageID } } = link;
    
    if (!client.guilds.cache.has(guildID) || guildID != message.guild.id) return;
    let channel = client.guilds.cache.get(guildID).channels.cache.get(channelID);
    if (!channel || channel.nsfw) return; 

    try {
        const msg = await channel.messages.fetch(messageID);
    
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
        
        let attachmentLink = /https?:\/\/(?:cdn\.)?discord(?:app)?\.com\/attachments\/\d{17,19}\/\d{17,20}\/(?<name>\w*)(?:\.png|\.jpg|\.jpeg|\.webp|\.gif)/i.exec(msg.content);
        if (!embed.image && (msg.attachments || attachmentLink != null))
            embed.setImage(msg.attachments ? msg.attachments.map(a => a.url).filter((item, ind) => item)[0] : attachmentLink[0]);
    
    } catch(e) { return console.log(`${message.author.tag}(${message.author.id}) cause the following error:\n${e}`) }

    content = content.replace(/https?:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/channels\/(?:@me|\d{17,19}\/)?\d{17,20}\/\d{17,20}/.exec(content)[0], ``);
    args = parseArgs(content);
    
    if (recursiveCount < 1)
        module.exports.run(client, message, args, ++recursiveCount);
    else message.delete();
}