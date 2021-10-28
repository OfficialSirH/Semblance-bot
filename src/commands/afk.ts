import type { Message } from 'discord.js';
import type { Command } from '#lib/interfaces/Semblance';
import { MessageEmbed } from 'discord.js';
import { randomColor } from '#constants/index';
import { Afk } from '#models/Afk';

export default {
  description: 'Set yourself afk so users know you\'re unavailable when they ping you.',
  category: 'utility',
  usage: {
    '<reason>': 'Provide your reason why you\'re afk, or don\'t and it\'ll default \'just because\'.',
  },
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message, args) => run(message, args),
} as Command<'utility'>;

const run = async (message: Message, args: string[]) => {
  const reason = args.length > 0 ? args.join(' ') : 'Just because';
  const afkHandler = await Afk.findOne({ userId: message.author.id });
  if (!afkHandler) await new Afk({ userId: message.author.id, reason: reason }).save();
  else await Afk.findOneAndUpdate({ userId: message.author.id }, { $set: { reason: reason } });

  const embed = new MessageEmbed()
    .setTitle('AFK')
    .setColor(randomColor)
    .setDescription(`You are now afk ${message.author} \n` + `Reason: ${reason}`);
  message.channel.send({ embeds: [embed] });
};
