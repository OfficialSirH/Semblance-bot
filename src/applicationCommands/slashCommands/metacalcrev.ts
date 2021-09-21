import { nameToScNo, bigToName, checkValue } from '@semblance/constants';
import { MessageEmbed, CommandInteraction, User } from 'discord.js';
import { randomColor } from '@semblance/constants';
import type { Semblance } from '@semblance/structures';

module.exports.permissionRequired = 0;

module.exports.run = async (client: Semblance, interaction: CommandInteraction) => {
    let metabits = interaction.options.get('metabit').value;
    if (!checkValue(metabits as string)) return interaction.reply({ content: 'Your input for metabits was invalid', ephemeral: true });
    try {
        metabits = (metabits as string).match(/[a-z]/i) ? nameToScNo(metabits as string) : parseInt(metabits as string);
    } catch (e) {
        return interaction.reply({ content: 'Your input for metabits was invalid', ephemeral: true });
    }
    finally {
        let accumulated = Math.floor(Math.pow((metabits as number + 1) * 10000, 1 / 0.3333333333333333)),
        user = interaction.member.user as User,
        embed = new MessageEmbed()
                .setTitle("Accumulation Requirements")
                .setColor(randomColor)
                .setAuthor(user.tag, user.displayAvatarURL())
                .setDescription(`Metabit Input: ${metabits}\n\nEntropy/Idea Accumulation Required: ${bigToName(accumulated)}`);
        return interaction.reply({ embeds: [embed] });
    }
}