import { bigToName, checkValue, nameToScNo, randomColor } from '@semblance/constants';
import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import type { Command } from '@semblance/lib/interfaces/Semblance';

export default {
    description: "calculate the amount of metabits produced by entropy and ideas",
    category: 'calculator',
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 2,
    run: (_client, message, args) => run(message, args)
} as Command<'calculator'>;

const run = async (message: Message, args: string[]) => {
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
    message.reply({ embeds:[embed] });
}