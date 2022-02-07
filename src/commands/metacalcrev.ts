import { bigToName, checkValue, nameToScNo, prefix, randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import type { Command } from '#lib/interfaces/Semblance';
import type { Semblance } from '#structures/Semblance';

export default {
  description: 'calculate the required entropy/ideas for the specified metabits',
  category: 'calculator',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message, args) => run(client, message, args),
} as Command<'calculator'>;

const run = async (client: Semblance, message: Message, args: string[]) => {
  if (args.length == 0)
    return message.reply(
      `an example of $${prefix}metacalcrev is $${prefix}metacalcrev 500M, which means an input of 500 million metabits which will output the amount of entropy and ideas you'd need an accumulation of.`,
    );
  let metabits: string | number = args[0];
  if (!checkValue(metabits as string)) return message.reply('Your input for metabits was invalid');
  metabits = nameToScNo(metabits as string);
  const accumulated = Math.floor(Math.pow(((metabits as number) + 1) * 10000, 1 / 0.3333333333333333)),
    embed = new MessageEmbed()
      .setTitle('Accumulation Requirements')
      .setColor(randomColor)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`Metabit Input: ${metabits}\n\nEntropy/Idea Accumulation Required: ${bigToName(accumulated)}`);
  message.reply({ embeds: [embed] });
};
