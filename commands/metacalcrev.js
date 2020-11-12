const { MessageEmbed } = require('discord.js'),
    { nameToScNo, bigToE, checkIfAllowedValue } = require('../constants/largeNumberConversion.js');

module.exports = {
    description: "",
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    if (args.length == 0) return message.reply('an example of `s!metacalcrev` is `s!metacalcrev 500M`, which means an input of 500 million metabits which will output the amount of entropy and ideas you\'d need an accumulation of.');
    let metabits = args[0];
    metabits = checkIfAllowedValue(metabits, message, 'metabits');
    if (isNaN(metabits)) return;
    let accumulated = Math.floor(Math.pow((metabits + 1) * 10000, 1 / 0.3333333333333333));
    message.reply(`You would need an accumulation of ${bigToE(accumulated)} entropy & ideas`);
}