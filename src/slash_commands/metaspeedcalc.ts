import { nameToScNo, bigToName, checkValue } from '@semblance/constants';
import { MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance, Interaction } from '@semblance/structures';

module.exports.permissionRequired = 0;

module.exports.run = async (client: Semblance, interaction: Interaction) => {
    let options = interaction.data.options,
        metabits: string | number = 0, dinoRanks = 0, simSpeed = 0;
    for (let i = 0; i < options.length; i++) switch(options[i].name.toLowerCase()) {
        case 'metabit': 
            metabits = options[i].value as string;
            break;
        case 'mv_ranks':
            dinoRanks = (options[i].value <= 550) ? options[i].value as number : 550;
            break;
        case 'speed_upgrades':
            simSpeed = (options[i].value <= 2105) ? options[i].value as number : 2105;
    }
    if (!checkValue(metabits as string)) return interaction.send('Your input for metabits was invalid', { ephemeral: true });
    metabits = nameToScNo(metabits as string);
    let num = 1.0;

    if (metabits > 1000.0) {
        var num2 = metabits as number - 1000.0;
        num += 10.0;

        if (num2 > 100000.0) {
            var num3 = num2 - 100000.0;
            num += 10.0;

            if (num3 > 300000000.0) {
                var num4 = num3 - 300000000.0;
                num += 300;
                if (num4 > 1000000000000.0) {
                    let num5 = num4 - 1000000000000.0;
                    num += 10000.0;
                    num += num5 * 0.009999999776482582 / 100000000.0;
                }
                else {
                    num += num4 * 0.009999999776482582 / 1000000.0;
                }
            }
            else {
                num += num3 * 0.009999999776482582 / 10000.0;
            }

        }
        else {
            num += num2 * 0.009999999776482582 / 100.0;
        }
    }
    else {
        num += metabits as number * 0.009999999776482582;
    }
    let dinoPrestigeBonus = (dinoRanks == 550) ? 10 : (Math.ceil(dinoRanks / 50) > Math.floor(dinoRanks / 50)) ? Math.floor(dinoRanks / 50) : Math.floor(dinoRanks / 50)-1;
    let dinoranksMulti = 1 + dinoRanks * 0.1 + dinoPrestigeBonus * 0.5;
    num *= (dinoRanks == 0) ? 1 : dinoranksMulti;
    num *= ((simSpeed / 100) + 1);
    let embed = new MessageEmbed()
        .setTitle("Multiplier Total")
        .setAuthor(interaction.member.user.tag, interaction.member.user.displayAvatarURL())
        .setColor(randomColor)
        .setDescription([`Total Collected Metabits/Simulation Level: ${bigToName(metabits)}`,
            `Accumulated Mesozoic Valley Ranks: ${dinoRanks}`,
            `Simulation Speed Upgrades: ${simSpeed}%`,
            `Production/Total Multiplier: x${bigToName(num)}`].join('\n'))
        .setFooter("P.S. Mesozoic Valley rank accumulation caps at 550 and simulation speed upgrades cap at 2105%.");
    return interaction.send(embed);
}
