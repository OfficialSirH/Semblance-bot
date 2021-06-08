import { nameToScNo, bigToName, checkValue } from '@semblance/constants';
import { MessageEmbed, CommandInteraction } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance } from '@semblance/structures';

module.exports.permissionRequired = 0;

module.exports.run = async (client: Semblance, interaction: CommandInteraction) => {
    let metabits = interaction.options[0].value;
    if (!checkValue(metabits as string)) return interaction.reply('Your input for metabits was invalid', { ephemeral: true });
    metabits = nameToScNo(metabits as string);
    let accumulated = Math.floor(Math.pow((metabits as number + 1) * 10000, 1 / 0.3333333333333333)),
        embed = new MessageEmbed()
            .setTitle("Accumulation Requirements")
            .setColor(randomColor)
            .setAuthor(interaction.member.user.tag, interaction.member.user.displayAvatarURL())
            .setDescription(`Metabit Input: ${metabits}\n\nEntropy/Idea Accumulation Required: ${bigToName(accumulated)}`);
    return interaction.reply(embed);
}