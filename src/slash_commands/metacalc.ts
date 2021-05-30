import { nameToScNo, bigToName, checkValue } from '@semblance/constants';
import { MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance, Interaction } from '@semblance/structures';

module.exports.permissionRequired = 0;

module.exports.run = async (client: Semblance, interaction: Interaction) => {
    let entropy = interaction.data.options[0].value, ideas = interaction.data.options[1].value;
    if (!checkValue(entropy as string)) return interaction.send('Your input for entropy was invalid', { ephemeral: true });
    if (!checkValue(ideas as string)) return interaction.send('Your input for ideas was invalid', { ephemeral: true });
    entropy = nameToScNo(entropy as string);
    ideas = nameToScNo(ideas as string);
    let metabits = Math.floor(Math.pow(entropy as number + (ideas as number), 0.3333333333333333) / 10000 - 1);
    let embed = new MessageEmbed()
        .setTitle("Metabits Produced")
        .setColor(randomColor)
        .setAuthor(interaction.member.user.tag, interaction.member.user.displayAvatarURL())
        .setDescription(`Entropy Input: ${entropy}\nIdea Input: ${ideas}\n\nMetabits Produced: ${(metabits < 1) ? 0 : bigToName(metabits)}`);
    return interaction.send(embed);
}