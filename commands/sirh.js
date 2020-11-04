const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js');

module.exports = {
    description: "Secret command about SirH",
    usage: {
        "": ""
    },
    permissionRequired: 0,
    aliases: ['SirH', 'sirH', 'Sirh', 'SIRH'],
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    if (args.length == 0) return message.reply("What's this? You seem to have discovered part 1 of my secret. To find part 2, you'll need to type `s!sirh ` then type the name of the song that was played in this video. 👀\n Anyway, here's the link to my English 12 school project I did. https://youtu.be/icB8CjlTZMg");
    var decision = args.join(" ");
    if (decision.toLowerCase() == "we are number one") return message.reply("Congrats! You have discovered part 2 of my secret! Part 2 hasn't been released yet, but it will be soon. 👀");
    return message.reply("That is not the correct answer!");
}