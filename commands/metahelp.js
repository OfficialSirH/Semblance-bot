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
    let embed = new MessageEmbed()
        .setTitle("Metabit Calculator Help")
        .attachFiles(currentLogo)
        .setThumbnail("attachment://Current_Logo.png")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription("The Metabit Calculator supports Scientific Notation, which means you can type numbers like 1E25, as well as names for numbers like million all the way to vigintillion;" +
            " Use s!largenumbers to get more info on large numbers.")
        .addFields(
            {
                name: "metacalc",
                value: "This command requires two inputs: first entropy, then ideas, which this command will then add up the two inputs(accumulation) and process the amount of metabits that would produce."
            },
            {
                name: 'metacalcrev',
                value: 'This command does the reverse of "metacalc" and will take in an input of metabits and process the accumulation of entropy&ideas you would need to produce that many metabits.'
            },
            {
                name: 'metacalc example',
                value: 's!metacalc 1E23 1.59E49, this example shows 1E23 entropy and 1.59E49 ideas being used for input.'
            },
            {
                name: 'metacalcrev example',
                value: 's!metacalcrev 1E6, this example is using 1E6 (or 1 million) metabits as input.'
            }
        )
        .setFooter("Metabit Calculator goes brrr.");
    message.channel.send(embed);
}