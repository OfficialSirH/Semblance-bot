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
        .setDescription([`+ Moved rick roll from \`s!secret\` due to certain... *complaints.*`,
            `+ New (temporary) code added, check \`s!codes\``].join('\n'));
    message.channel.send(embed);
}
