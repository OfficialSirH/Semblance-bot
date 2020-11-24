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
    let embed = new MessageEmbed()
        .setTitle("Darwinium Codes")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setColor(randomColor())
        .attachFiles(currentLogo)
        .setThumbnail("attachment://Current_Logo.png")
        .setDescription(['DARWIN','STRIPES', 'EVOLVE (Works until November 30th)'].join('\n'))
        .addField("Expired(meaning these don't work)", ["MANIA", "TWITCH", "FINALS", "SCALES", 'POEM', 'GLITCH'].join('\n'))
        .setFooter("Magical Codes!");
    message.channel.send(embed);
}
