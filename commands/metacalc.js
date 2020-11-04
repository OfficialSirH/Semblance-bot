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
    if (args.length == 0) return message.reply('An example of this command would be `s!metacalc 58T 67T`, which translates to an input of 58 trillion entropy and 67 trillion ideas which will then output the amount of metabits you\'d accumulate from that.');
    if (args.length == 1) return message.reply('You forgot input for "ideas".');
    var entropy = args[0], ideas = args[1];
    entropy = checkIfAllowedValue(entropy, message, 'entropy');
    ideas = checkIfAllowedValue(ideas, message, 'ideas');
    if (isNaN(entropy)) return;
    if (isNaN(ideas)) return;
    //var metabits = Math.sqrt(entropy+(ideas/10E12));
    var metabits = Math.floor(Math.pow(entropy + ideas, 0.3333333333333333) / 10000 - 1);
    if (metabits < 1) {
        message.reply("That would produce ***nothing***!");
        return;
    }
    // metabits + 1 = Math.floor(Math.pow(entropy+ideas, 0.3333333333333333) / 10000);
    // (metabits + 1) * 10000 = Math.floor(Math.pow(entropy+ideas, 0.3333333333333333));
    // Math.floor(Math.pow((metabits+1) * 10000), 1/0.3333333333333333) = entropy+ideas;
    message.reply(`That would produce ${bigToE(metabits)} metabit(s)!`);
}