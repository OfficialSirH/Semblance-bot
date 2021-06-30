import { bigToName, checkValue, nameToScNo, randomColor } from '@semblance/constants';
import { Message, MessageEmbed } from 'discord.js';
import { Semblance } from '../structures';
import config from '@semblance/config';
const { prefix } = config;

module.exports = {
    description: "",
    category: 'calculator',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: any[]) => {
    if (args.length == 0) return message.reply(`an example of \`${prefix}metacalcrev\` is \`${prefix}metacalcrev 500M\`, which means an input of 500 million metabits which will output the amount of entropy and ideas you'd need an accumulation of.`);
    let metabits: string | number = args[0];
    if (!checkValue(metabits as string)) return message.reply('Your input for metabits was invalid');
    metabits = nameToScNo(metabits as string);
    let accumulated = Math.floor(Math.pow((metabits as number + 1) * 10000, 1 / 0.3333333333333333)),
        embed = new MessageEmbed()
            .setTitle("Accumulation Requirements")
            .setColor(randomColor)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`Metabit Input: ${metabits}\n\nEntropy/Idea Accumulation Required: ${bigToName(accumulated)}`);
    message.reply({ embeds: [embed] });
}