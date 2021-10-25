import type { Message, Snowflake, User } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { getAvatar, randomColor } from '#constants/index';
import type { Semblance } from '#structures/Semblance';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: "See a user's avatar.",
  category: 'utility',
  usage: {
    '<userId/mention>': '',
  },
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message, args) => run(client, message, args),
} as Command<'utility'>;

const run = async (client: Semblance, message: Message, args: string[]) => {
  let user: User, userId: Snowflake;
  if (!args || args.length == 0) user = message.author;
  else {
    user = message.mentions.users.first();
    if (!user) {
      userId = args[0].match(/\d{17,20}/).join();
      if (!userId) return message.reply('The provided input is invalid');
      user = await client.users.fetch(userId, { cache: false });
    }
    if (!user) return message.reply("I couldn't find that user");
  }
  let embed = new MessageEmbed()
    .setTitle('Avatar')
    .setAuthor(user.tag, user.displayAvatarURL())
    .setColor(randomColor)
    .setImage(getAvatar(user));
  message.channel.send({ embeds: [embed] });
};
