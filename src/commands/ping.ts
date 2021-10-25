import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'Pings a user',
  category: 'semblance',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => message.channel.send(`Pinging me gets you pinged, <@${message.author.id}> :D`),
} as Command<'semblance'>;
