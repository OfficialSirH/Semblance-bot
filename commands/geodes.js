const { MessageEmbed } = require('discord.js'),
    { geodeImage, currentLogo } = require('../config.js');

module.exports = {
    description: "Get geode comparisons to show the best value.",
    category: 'game',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let embed = new MessageEmbed()
        .setTitle("Geodes Comparison")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .attachFiles([geodeImage, currentLogo])
        .setThumbnail(currentLogo.name)
        .setImage(geodeImage.name)
        .setDescription("The top row of the image represents the rewards from each geode at rank 50, " +
            "while the bottom row represents the geode rewards at rank 4, " +
            "which rank 4 is shown instead of 1 because the diamond geode isn't unlocked until rank 4. " +
            "By the shown results within this image, it's highly recommended to get geodes at rank 50 for the greatest rewards for the same price as rank 4.")
        .setFooter(`Diamond Geodes for da win!`);
    message.channel.send(embed);
}