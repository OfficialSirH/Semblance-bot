import { Command } from '@sapphire/framework';
import { messageLinkJump } from '#constants/commands';

// this should not be an admin category command
export default {
  description: 'This command can create a direct jump/preview of a message link',
  category: 'admin',
  usage: {
    '<true/t or false/f>': '',
  },
  permissionRequired: 0,
  checkArgs: () => true,
  run: async (client, message, args) => {
    message.channel.send(await messageLinkJump(args[0], message.author, message.guild, client));
  },
} as Command<'admin'>;
