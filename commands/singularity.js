const { MessageEmbed } = require('discord.js'),
    {randomColor} = require('../constants'),
    { currentLogo, singularity } = require('../config').default;

module.exports = {
    description: "",
    category: 'game',
    subcategory: 'main',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let embed = new MessageEmbed()
        .setTitle(`${singularity}Singularity`)
        .setColor(randomColor)
        .attachFiles(currentLogo)
        .setThumbnail(currentLogo.name)
        .setDescription("So you've reached the singularity upgrade and the simulation crashed for some reason? well let me just tell you that the simulation didn't actually crash; I just wanted to prank you and restart all your work ***mwuahahahaha***... but seriously, it's a new journey from here out now. You can gain metabits (prestige currency), which will boost your earnings the more you collect.");
    message.channel.send(embed);
}