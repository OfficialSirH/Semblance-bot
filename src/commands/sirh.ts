import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import type { Semblance } from '#structures/Semblance';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'Secret command about SirH',
  category: 'secret',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client: Semblance, message: Message, args: string[]) => run(client, message, args),
} as Command<'secret'>;

const run = async (client: Semblance, message: Message, args: string[]) => {
  // Will be implementing some secrets here later, not sure what it will be yet
};
