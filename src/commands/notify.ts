import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import config from '#config';
import type { Command } from '#lib/interfaces/Semblance';
const { sirhGuildId } = config;

export default {
  description:
    "This command will give you the the notification role for Semblance related announcements(Only SirH's server)",
  category: 'utility',
  usage: {
    '<add/remove>': "Gives the notification role or removes it depending on if you typed 'add' or 'remove'",
  },
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message, args) => run(message, args),
} as Command<'utility'>;

const run = async (message: Message, args: string[]) => {
  if (message.guild.id != sirhGuildId) return message.reply("This command is exclusive to SirH's server.");
  let sembNotifications = message.guild.roles.cache.find(r => r.name == 'Semblance Notifications');
  let hasRole = message.member.roles.cache.has(sembNotifications.id);

  if (args[0] == 'remove' && hasRole) {
    message.member.roles.remove(sembNotifications);
    return message.reply('Your role was successfully removed');
  }
  if (args[0] == 'remove') return message.reply('You currently do not have the role.');

  if (args[0] == 'add' && hasRole) return message.reply('You currently have the role.');
  if (args[0] == 'add') {
    message.member.roles.add(sembNotifications);
    return message.reply('Your role was successfully added');
  }

  return message.reply({
    embeds: [
      new MessageEmbed()
        .setTitle('Semblance Notifications')
        .setColor(randomColor)
        .setDescription(
          `${exports.default.description}\n` +
            `**How to use:** type \`add\` at the end to get role or \`remove\` to remove it.`,
        ),
    ],
  });
};
