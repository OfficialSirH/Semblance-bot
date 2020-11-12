const { MessageEmbed } = require('discord.js'),
    randomColor = require('../constants/colorRandomizer.js'),
    { trexSkull } = require('./emojis.js'),
    { currentLogo } = require('../config.js');

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
        .setTitle(`${trexSkull} Mesozoic Valley`)
        .setColor(randomColor())
        .attachFiles(currentLogo)
        .setThumbnail("attachment://Current_Logo.png")
        .setDescription("look to the right side of the tetrapods in the evolution tree, the Mesozoic Valley should be right next to egg shells and it should look like a rock, unless you already opened it and it's a skull instead. Also, the more you rank up in Mesozoic Valley, the better of a boost you'll gain in the main simulation");
    message.channel.send(embed);
}