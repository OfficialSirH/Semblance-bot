const { MessageEmbed, MessageAttachment } = require('discord.js'),
    randomColor = require('../constants/colorRandomizer.js'),
    { currentLogo, prestigeImage } = require('../config.js');

module.exports = {
    description: "Get info on the Mesozoic Valley prestige.",
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let embed = new MessageEmbed()
        .setTitle("Mesozoic Valley Prestige")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setColor(randomColor())
        .attachFiles(prestigeImage, currentLogo)
        .setImage("attachment://Prestige.png")
        .setThumbnail("attachment://currentLogo.png")
        .setDescription("Prestige in the Mesozoic Valley is unlocked at rank 50, which is also the rank that is recommended to purchase the diamond geode. Prestige also allows you to keep your Mutagen.")
        .setFooter("Footer goes brrr... I don't understand this meme.");
    message.channel.send(embed);
}