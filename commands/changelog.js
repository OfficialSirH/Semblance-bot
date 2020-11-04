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
    var embed = new MessageEmbed()
        .setTitle("Changelog")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setColor(randomColor())
        .setDescription("+ New command: `s!jumptoggle`/`s!jump`, which allows you to disable or enable the `jump` feature that converts message links to embeds.\n" +
            "+ Voting will now give a boost to your idle game in Semblance's Idle Game. 2 hour boost for weekdays and 4 hour boost for weekends.\n" +
            "+ I think there was something else I changed but I can't remember... other than a little fix that will auto-delete MEE6's posts in #cells-tweets cause no one likes MEE6.");
    message.channel.send(embed);
}
