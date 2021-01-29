const { MessageEmbed } = require('discord.js'),
    { nameToScNo, bigToE, slash_checkIfAllowedValue } = require('../constants/largeNumberConversion.js');

module.exports.permissionRequired = 0;

module.exports.run = async (client, interaction) => {
    //if (args.length == 0) return [{ content: 'An example of this command would be `s!metacalc 58T 67T`, which translates to an input of 58 trillion entropy and 67 trillion ideas which will then output the amount of metabits you\'d accumulate from that.' }];
    //if (args.length == 1) return [{ content: 'You forgot input for "ideas".' }];
    let entropy = interaction.data.options[0].value, ideas = interaction.data.options[1].value;
    entropy = slash_checkIfAllowedValue(entropy, 'entropy');
    ideas = slash_checkIfAllowedValue(ideas, 'ideas');
    if (isNaN(entropy)) return entropy;
    if (isNaN(ideas)) return ideas;
    //let metabits = Math.sqrt(entropy+(ideas/10E12));
    let metabits = Math.floor(Math.pow(entropy + ideas, 0.3333333333333333) / 10000 - 1);
    let embed = new MessageEmbed()
        .setTitle("Metabits Produced")
        .setAuthor(interaction.member.user.tag, interaction.member.user.avatarURL)
        .setDescription(`Entropy Input: ${entropy}\nIdea Input: ${ideas}\n\nMetabits Produced: ${(metabits < 1) ? 0 : bigToE(metabits)}`);
    return [{ embeds: [embed.toJSON()] }];
    /*if (metabits < 1) {
        return [{ content: "That would produce ***nothing***!" }];
    }*/
    // metabits + 1 = Math.floor(Math.pow(entropy+ideas, 0.3333333333333333) / 10000);
    // (metabits + 1) * 10000 = Math.floor(Math.pow(entropy+ideas, 0.3333333333333333));
    // Math.floor(Math.pow((metabits+1) * 10000), 1/0.3333333333333333) = entropy+ideas;
    
    //[{ content: `That would produce ${bigToE(metabits)} metabit(s)!` }];
}