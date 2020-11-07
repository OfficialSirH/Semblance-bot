const { MessageEmbed } = require('discord.js'),
    randomColor = require('../constants/colorRandomizer.js'),
    { currentLogo } = require('../config.js');

module.exports = {
    description: "get all of the ingame codes",
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    var embed = new MessageEmbed()
        .setTitle("Darwinium Codes")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setColor(randomColor())
        .attachFiles(currentLogo)
        .setThumbnail("attachment://Current_Logo.png")
        .setDescription('DARWIN\nPOEM\nGLITCH\nSTRIPES')
        .addField("Expired(meaning these don't work)", "MANIA\nTWITCH\nFINALS\nSCALES")
        .setFooter("Magical Codes!");
    message.channel.send(embed);
}
