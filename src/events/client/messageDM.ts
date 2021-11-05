import { parseArgs, prefix } from '#constants/index';
import { EventHandler } from '#lib/interfaces/Semblance';
import type { Semblance } from '#structures/Semblance';
import type { Message } from 'discord.js';

export default {
  name: 'messageDM',
  exec: (message, client) => messageDM(message, client),
} as { name: 'messageDM'; exec: EventHandler<'messageCreate'>['exec'] };

export const messageDM = (message: Message, client: Semblance) => {
  const { commands, aliases } = client;
  // s! is deprecated and should be removed in the future
  if (message.content.startsWith('s!') || message.content.match(`^<@!?${client.user.id}> `)) {
    let splitContent = message.content.split(' ');
    if (splitContent[0].match(`^<@!?${client.user.id}>`)) splitContent.shift();
    else splitContent = message.content.slice(2).split(' ');
    const identifier = splitContent.shift().toLowerCase(),
      command = aliases[identifier] || identifier;
    const content = splitContent.join(' ');

    const commandFile = commands[command];
    if (commandFile && commandFile.category == 'dm') {
      const args = parseArgs(content);
      try {
        if (commandFile.checkArgs(args)) commandFile.run(client, message, args, identifier, { content });
        else
          message.channel.send(
            `❌ Invalid arguments! Usage is ${prefix} ${command}${Object.keys(commandFile.usage)
              .map(a => ' ' + a)
              .join('')}, for additional help, see ${prefix} help.`,
          );
      } catch {}
    }
  }
};
