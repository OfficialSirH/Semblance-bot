import { bigToName, checkValue, nameToScNo, randomColor } from '@semblance/constants';
import { Message, MessageEmbed } from 'discord.js';
import { Semblance } from '../structures';

module.exports = {
    description: "",
    category: 'calculator',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 2
}

module.exports.run = async (client: Semblance, message: Message, args: any[]) => {
    let entropy: string | number, ideas: string | number;
    [entropy, ideas] = args;
    if (!checkValue(entropy as string)) message.reply('Your input for Entropy is invalid');
    if (!checkValue(ideas as string)) message.reply('Your input for Idea is invalid');
    entropy = nameToScNo(entropy as string);
    ideas = nameToScNo(ideas as string);
    //let metabits = Math.sqrt(entropy+(ideas/10E12));
    let metabits = Math.floor(Math.pow(entropy as number + (ideas as number), 0.3333333333333333) / 10000 - 1);
    // metabits + 1 = Math.floor(Math.pow(entropy+ideas, 0.3333333333333333) / 10000);
    // (metabits + 1) * 10000 = Math.floor(Math.pow(entropy+ideas, 0.3333333333333333));
    // Math.floor(Math.pow((metabits+1) * 10000), 1/0.3333333333333333) = entropy+ideas;
    let embed = new MessageEmbed()
        .setTitle("Metabits Produced")
        .setColor(randomColor)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`Entropy Input: ${entropy}\nIdea Input: ${ideas}\n\nMetabits Produced: ${(metabits < 1) ? 0 : bigToName(metabits)}`);
    message.reply(embed);
}