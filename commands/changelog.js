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
        .setDescription([`+ something new is in \`s!currency\`. 👀`,
            `+ added new code in \`s!codes\``,
            `+ Reminders in \`s!remindme\` now stay even after Semblance reboots!`,
            `+ added an argument into \`s!beyond\`: \`s!beyond clips\``,
            `+ Updated road map in \`s!beyond\``].join('\n'));
    message.channel.send(embed);
}
