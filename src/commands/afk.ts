import { Command } from '#lib/interfaces/Semblance';

export default {
  name: 'afk',
  description: 'Makes you AFK',
  checkArgs: () => true,
  permissionRequired: 0,
  category: 'utility',
  run: (_, message) => {
    message.reply(
      "This command has been removed along with many other changes that has been done for Semblance to comply with the message content intent from Discord, read Semblance's changelog with `/help query: changelog` for a list of Semblance's changes.",
    );
  },
} as Command<'utility'>;
