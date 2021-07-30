import { nameToScNo, bigToName, checkValue } from '@semblance/constants';
import { MessageEmbed, CommandInteraction, User } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance } from '@semblance/structures';

module.exports.permissionRequired = 0;

module.exports.run = async (client: Semblance, interaction: CommandInteraction) => {
    let entropy = interaction.options.get('entropy').value, ideas = interaction.options.get('idea').value;
    if (!checkValue(entropy as string)) return interaction.reply({ content: 'Your input for entropy was invalid', ephemeral: true });
    if (!checkValue(ideas as string)) return interaction.reply({ content: 'Your input for ideas was invalid', ephemeral: true });
    try {
        entropy = (entropy as string).match(/[a-z]/i) ? nameToScNo(entropy as string) : parseInt(entropy as string);
        ideas = (ideas as string).match(/[a-z]/i) ? nameToScNo(ideas as string) : parseInt(ideas as string);
    } catch (err) {
        return interaction.reply({ content: 'Something went wrong, please try again', ephemeral: true });
    }
    finally {
        let metabits = Math.floor(Math.pow(entropy as number + (ideas as number), 0.3333333333333333) / 10000 - 1),
        user = interaction.member.user as User,
        embed = new MessageEmbed()
        .setTitle("Metabits Produced")
        .setColor(randomColor)
        .setAuthor(user.tag, user.displayAvatarURL())
        .setDescription(`Entropy Input: ${entropy}\nIdea Input: ${ideas}\n\nMetabits Produced: ${(metabits < 1) ? 0 : bigToName(metabits)}`);
        return interaction.reply({ embeds: [embed] });
    }
}