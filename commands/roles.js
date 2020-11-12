const { MessageEmbed } = require('discord.js'), { currentLogo } = require('../config.js');

module.exports = {
    description: "",
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let embed = new MessageEmbed()
        .setTitle("C2S Roles")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .attachFiles(currentLogo)
        .setThumbnail("attachment://Current_Logo.png")
        .setDescription("**Reality Expert**: This role is gained upon sending a screenshot of 1 billion accumulated metabits from your stats page to <#496430259114082304>.\n" +
            "**Paleontologist**: This role is gained once you've unlocked and sent a screenshot of the T-rex to <#496430259114082304>.\n" +
            "**Beta Tester**: This role is gained when you've joined and sent proof of being part of the beta program for C2S to <#496430259114082304>.")
        .setFooter("*Epic* roles.");
    message.channel.send(embed);
}
