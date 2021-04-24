const { MessageEmbed } = require('discord.js'),
    { nameToScNo, bigToE, slash_checkIfAllowedValue } = require('../constants/largeNumberConversion.js');

module.exports.permissionRequired = 0;

module.exports.run = async (client, interaction) => {
    let metabits = interaction.data.options[0].value;
    metabits = slash_checkIfAllowedValue(metabits, 'metabits');
    if (isNaN(metabits)) return interaction.send('Your input for metabits was invalid', { ephemeral: true });
    let accumulated = Math.floor(Math.pow((metabits + 1) * 10000, 1 / 0.3333333333333333)),
        embed = new MessageEmbed()
            .setTitle("Accumulation Requirements")
            .setAuthor(interaction.member.user.tag, interaction.member.user.displayAvatarURL())
            .setDescription(`Metabit Input: ${metabits}\n\nEntropy/Idea Accumulation Required: ${bigToE(accumulated)}`);
    return interaction.send(embed);
}