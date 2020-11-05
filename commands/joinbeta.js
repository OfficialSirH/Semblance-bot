const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js'), { currentLogo } = require('../config.js'); 

module.exports = {
    description: "Info on how to become a beta tester",
    usage: {
        "": ""
    },
    aliases: ['betajoin', 'betaform'],
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    var embed = new MessageEmbed()
        .setTitle('Steps to join beta')
        .setColor(randomColor())
        .attachFiles(currentLogo)
        .setThumbnail("attachment://Current_Logo.png")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`Steps to join the beta testing of CelltoSingularity can be found in the form. \n` +
                            `https://docs.google.com/document/d/1Ov_XvSn2AN1Q0EVJLgCnxfVkzdn6EL72LH5bhDP-aSc/edit?usp=sharing \n`+
                            `Please read the form completely before asking any doubts \n`+
                            `NOTE : the beta versions of the game will have a lot of bugs and there is a possibility that you might lose your progress, Enter at your own will \n`+
                            `**REMINDER : DO NOT POST YOUR EMAIL IN THE PUBLIC CHAT**`)
        .setFooter(`Called by ${message.author.tag}`);
    message.channel.send(embed);
}
