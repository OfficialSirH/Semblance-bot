import { bigToName, checkValue, nameToScNo, randomColor } from '@semblance/constants';
import { Message, MessageEmbed } from 'discord.js';
import { Semblance } from '../structures';

module.exports = {
    description: "Provides the production multiplier when given metabit input.",
    category: 'calculator',
    usage: {
        "<metabits>": "Inputting any number of metabits will output the production multiplier."
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: any[]) => {
    if (args.length == 0) return message.reply(`The usage of this command is metaspeedcalc <metabits> <total meso ranks accumulated> <simulation speed upgrades percentage>`);
    if (args.length == 1) return message.reply('You forgot input for `accumulated meso ranks` and `sim speed upgrades percentage`');
    if (args.length == 2) return message.reply('You forgot input for `sim speed upgrades percentage`');

    let metabits: string | number = args[0];
    if (!checkValue(metabits as string)) return message.reply('Your input for metabits is invalid');
    metabits = nameToScNo(metabits as string);
    let dinoRanks = (Math.floor(args[1].replace(/\D/g, '')) > 550) ? 550 : Math.floor(args[1].replace(/\D/g, ''));
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
    num *= dinoranksMulti;
    let simspeed = (Math.floor(args[2].replace(/\D/g, '')) > 2105) ? 2105 : Math.floor(args[2].replace(/\D/g, ''));
    num *= ((simspeed / 100) + 1);
    let embed = new MessageEmbed()
        .setTitle("Multiplier Total")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription([`Total Collected Metabits/Simulation Level: ${bigToName(metabits)}`,
            `Accumulated Mesozoic Valley Ranks: ${dinoRanks}`,
            `Simulation Speed Upgrades: ${simspeed}%`,
            `Production/Total Multiplier: x${bigToName(num)}`].join('\n'))
        .setFooter("P.S. Mesozoic Valley rank accumulation caps at 550 and simulation speed upgrades cap at 2105%.");
    message.channel.send({ embeds: [embed] });
}