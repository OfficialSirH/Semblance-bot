const { MessageEmbed } = require('discord.js'),
    {randomColor} = require('../constants'),
    { currentLogo } = require('../config.js').default,
    { Information } = require('./edit.js');

module.exports = {
    description: "get all of the ingame codes",
    category: 'game',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let codeHandler = await Information.findOne({ infoType: 'codes' });
    let embed = new MessageEmbed()
        .setTitle("Darwinium Codes")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .attachFiles(currentLogo)
        .setThumbnail(currentLogo.name)
        .setDescription(codeHandler.info)
        .addField("Expired Codes", codeHandler.expired)
        .setFooter(codeHandler.footer);
    message.channel.send(embed);
}
