const { MessageEmbed } = require('discord.js'),
    { nameToScNo, bigToE, slash_checkIfAllowedValue } = require('../constants/largeNumberConversion.js');

module.exports.permissionRequired = 0;

module.exports.run = async (client, interaction) => {
    let metabits = interaction.data.options[0].value;
    //if (args.length == 0) return message.reply('an example of `s!metacalcrev` is `s!metacalcrev 500M`, which means an input of 500 million metabits which will output the amount of entropy and ideas you\'d need an accumulation of.');
    metabits = slash_checkIfAllowedValue(metabits, 'metabits');
    if (isNaN(metabits)) return metabits;
    let accumulated = Math.floor(Math.pow((metabits + 1) * 10000, 1 / 0.3333333333333333)),
        embed = new MessageEmbed()
            .setTitle("Accumulation Requirements")
            .setAuthor(interaction.member.user.tag, interaction.member.user.avatarURL)
            .setDescription(`Metabit Input: ${metabits}\n\nEntropy/Idea Accumulation Required: ${bigToE(accumulated)}`);
    return [{ embeds: [embed.toJSON()] }];
}