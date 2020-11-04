const { MessageEmbed } = require('discord.js'),
    randomColor = require('../constants/colorRandomizer.js'),
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
    var embed = new MessageEmbed()
        .setTitle("Reboot")
        .setColor(randomColor())
        .attachFiles(currentLogo)
        .setThumbnail("attachment://Current_Logo.png")
        .setDescription('**Reboot\'s location:** You can find the "Simulation Reboot" by  clicking on the (metabit) bar under your currency (entropy/ideas).\n'+
                       '**The importance of rebooting your simulation:** you gain metabits from your stimulation, which in order to use them and unlock their potential you need to reboot your stimulation.'+
                        'rebooting also offers a lot of speed boost and rewards');
    message.channel.send(embed);
}
