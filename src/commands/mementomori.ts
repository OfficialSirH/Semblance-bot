import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import { mementoMori } from '#config';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'Memento Mori',
  category: 'secret',
  aliases: ['memento', 'unus', 'unusannus'],
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message, args, identifier) => run(message, args, identifier),
} as Command<'secret'>;

const run = async (message: Message, args: string[], identifier: string) => {
  if (identifier == 'mementomori' || identifier == 'unusannus') return sendIt(message);
  if ((identifier == 'memento' && args[0] == 'mori') || (identifier == 'unus' && args[0] == 'mori'))
    return sendIt(message);
};

async function sendIt(message: Message) {
  const embed = new Embed()
    .setTitle('Memento Mori')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor)
    .setImage(mementoMori.name)
    .setDescription('[The Goodbye](https://www.youtube.com/watch?v=aDQ3nfBbPWM)');
  message.channel.send({ embeds: [embed], files: [mementoMori] });
  setTimeout(() => {
    if (!message.deleted) message.delete();
  }, 1000);
}
