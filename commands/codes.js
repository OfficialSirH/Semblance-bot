const { MessageEmbed } = require('discord.js'),
    randomColor = require('../constants/colorRandomizer.js'),
    { currentLogo } = require('../config.js'),
    { Information } = require('./edit.js');

module.exports = {
    description: "get all of the ingame codes",
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let codeHandler = await Information.findOne({ infoType: 'codes' });
    let embed = new MessageEmbed()
        .setTitle("Darwinium Codes")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setColor(randomColor())
        .attachFiles(currentLogo)
        .setThumbnail("attachment://Current_Logo.png")
        .setDescription(codeHandler.info) //DARWIN, STRIPES, FESTIVE
        .addField("Expired Codes", codeHandler.expired) // Expired Codes: MANIA, TWITCH, FINALS, SCALES, POEM, GLITCH, EVOLVE
        .setFooter("Magical Codes!");
    message.channel.send(embed);
}
