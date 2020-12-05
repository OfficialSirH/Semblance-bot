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
        .setDescription([`+ Semblance updates now appear *when* Semblance is finished updating.`,
            `+ \`s!metaspeedcalc\` is now up-to-date with the new simulation speed modifications from 7.22 beta.`,
            `+ \`s!afk\` will now keep people afk even after Semblance restarts/cycles.`,
            `+ Improved efficiency with configuration in \`config.js\``,
            `+ Updated road map in \`s!beyond\``].join('\n'));
    message.channel.send(embed);
}
