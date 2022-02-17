/* eslint-disable @typescript-eslint/no-unused-vars */
import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import type { SapphireClient } from '@sapphire/framework';
import { Command } from '@sapphire/framework';

export default {
  description: 'Secret command about SirH',
  category: 'secret',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client: SapphireClient, message: Message, args: string[]) => run(client, message, args),
} as Command<'secret'>;

const run = async (client: SapphireClient, message: Message, args: string[]) => {
  // Will be implementing some secrets here later, not sure what it will be yet
};
