const { MessageEmbed } = require('discord.js'), {randomColor} = require('../constants'), { Information } = require('./edit.js');

module.exports = {
    description: "Provides the latest changes to Semblance.",
    category: 'semblance',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let changelogHandler = await Information.findOne({ infoType: "changelog" });
    let embed = new MessageEmbed()
        .setTitle("Changelog")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(changelogHandler.info);
    message.channel.send(embed);
}
