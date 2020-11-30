const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js');

module.exports = {
    description: "Provides the latest changes to Semblance.",
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let embed = new MessageEmbed()
        .setTitle("Changelog")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setColor(randomColor())
        .setDescription([`+ Updated info for \`s!roles\`, \`s!update\`, & \`s!beta\``].join('\n'));
    message.channel.send(embed);
}
