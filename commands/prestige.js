const { MessageEmbed } = require('discord.js'),
    { currentLogo, prestige, prestigeList } = require('../config.js'),
    { randomColor } = require('../constants');

module.exports = {
    description: "Get info on the Mesozoic Valley prestige.",
    category: 'game',
    usage: {
        "": ""
    },
    aliases: ['prestigelist'],
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args, identifier) => {
    if ((args[0] && args[0].toLowerCase() == 'list') || identifier == 'prestigelist') return sendPrestigeList(message);
    let embed = new MessageEmbed()
        .setTitle("Mesozoic Valley Prestige")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .attachFiles([prestige, currentLogo])
        .setImage(prestige.name)
        .setThumbnail(currentLogo.name)
        .setDescription("Prestige in the Mesozoic Valley is unlocked at rank 50, which is also the rank that is recommended to purchase the diamond geode. " +
             "Prestige also allows you to keep your Mutagen. Type `s!prestigelist` or `s!prestige list` for a list of all Prestige!")
        .setFooter("Footer goes brrr... I don't understand this meme.");
    message.channel.send(embed);
}

function sendPrestigeList(message) {
    let embed = new MessageEmbed()
        .setTitle("Mesozoic Valley Prestige List")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .attachFiles([prestigeList, currentLogo])
        .setThumbnail(currentLogo.name)
        .setImage(prestigeList.name)
        .setFooter("Thanks to Hardik for this lovely list of Prestige :D");
    message.channel.send(embed);
}