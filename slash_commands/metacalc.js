const { MessageEmbed } = require('discord.js'),
    { nameToScNo, bigToE, slash_checkIfAllowedValue } = require('../constants/largeNumberConversion.js');

module.exports.permissionRequired = 0;

module.exports.run = async (client, interaction) => {
    let entropy = interaction.data.options[0].value, ideas = interaction.data.options[1].value;
    entropy = slash_checkIfAllowedValue(entropy, 'entropy');
    ideas = slash_checkIfAllowedValue(ideas, 'ideas');
    if (isNaN(entropy)) return interaction.send('Your input for entropy was invalid', { ephemeral: true });
    if (isNaN(ideas)) return interaction.send('Your input for ideas was invalid', { ephemeral: true });
    let metabits = Math.floor(Math.pow(entropy + ideas, 0.3333333333333333) / 10000 - 1);
    let embed = new MessageEmbed()
        .setTitle("Metabits Produced")
        .setAuthor(interaction.member.user.tag, interaction.member.user.displayAvatarURL())
        .setDescription(`Entropy Input: ${entropy}\nIdea Input: ${ideas}\n\nMetabits Produced: ${(metabits < 1) ? 0 : bigToE(metabits)}`);
    return interaction.send(embed);
}