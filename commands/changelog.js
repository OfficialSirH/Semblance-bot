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
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor())
        .setDescription([`+ both the voting and game leaderboard will now update every minute instead of 10 due to a significantly improved sorting algorithm being implemented.`].join('\n'));
    message.channel.send(embed);
}
