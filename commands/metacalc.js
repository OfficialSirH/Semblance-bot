const { MessageEmbed } = require('discord.js'), {randomColor} = require('../constants'),
    { nameToScNo, bigToE, checkIfAllowedValue } = require('../constants/largeNumberConversion.js');

module.exports = {
    description: "",
    category: 'calculator',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    if (args.length == 0) return message.reply('An example of this command would be `s!metacalc 58T 67T`, which translates to an input of 58 trillion entropy and 67 trillion ideas which will then output the amount of metabits you\'d accumulate from that.');
    if (args.length == 1) return message.reply('You forgot input for "ideas".');
    let entropy = args[0], ideas = args[1];
    entropy = checkIfAllowedValue(entropy, message, 'entropy');
    ideas = checkIfAllowedValue(ideas, message, 'ideas');
    if (isNaN(entropy)) return;
    if (isNaN(ideas)) return;
    //let metabits = Math.sqrt(entropy+(ideas/10E12));
    let metabits = Math.floor(Math.pow(entropy + ideas, 0.3333333333333333) / 10000 - 1);
    // metabits + 1 = Math.floor(Math.pow(entropy+ideas, 0.3333333333333333) / 10000);
    // (metabits + 1) * 10000 = Math.floor(Math.pow(entropy+ideas, 0.3333333333333333));
    // Math.floor(Math.pow((metabits+1) * 10000), 1/0.3333333333333333) = entropy+ideas;
    let embed = new MessageEmbed()
        .setTitle("Metabits Produced")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`Entropy Input: ${entropy}\nIdea Input: ${ideas}\n\nMetabits Produced: ${(metabits < 1) ? 0 : bigToE(metabits)}`);
    message.reply(embed);
}