import type { Message, GuildMember, User, Snowflake } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { randomColor } from '#constants/index';
import type { Semblance } from '#structures/Semblance';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'Get info on a specified user or yourself by default.',
  category: 'utility',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message, args) => run(client, message, args),
} as Command<'utility'>;

const run = async (client: Semblance, message: Message, args: string[]) => {
  if (args.length == 0) return guildProfileEmbed(message, message.member);

  const userRegexed = /(?<![:\d])(?<id>\d{17,19})(?!\d)/.exec(args[0]);
  if (!userRegexed) return message.reply("You've provided invalid input");
  const userId = userRegexed.groups.id as Snowflake;
  let member: GuildMember;
  try {
    member = await message.guild.members.fetch({ user: userId, cache: false });
  } catch {}
  if (member) return guildProfileEmbed(message, member);

  try {
    const user = await client.users.fetch(userId, { cache: false });
    if (user) return userProfileEmbed(message, user);
    message.reply("Sorry, that user couldn't be found in Discord at all");
  } catch (e) {
    console.log(e);
  }
};

async function guildProfileEmbed(message: Message, member: GuildMember) {
  let accountCreated = `${member.user.createdAt}`;
  accountCreated = `${accountCreated.substring(0, 16)}(${daysAgo(member.user.createdAt)})`;
  let accountJoined = `${member.joinedAt}`;
  accountJoined = `${accountJoined.substring(0, 16)}(${daysAgo(member.joinedAt)})`;
  const embed = new MessageEmbed()
    .setTitle('Guild User Profile')
    .setDescription(`User data for ${member}:`)
    .setColor(randomColor)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .addFields([
      { name: 'Username', value: member.user.tag, inline: true },
      { name: 'Discriminator', value: member.user.discriminator, inline: true },
      { name: 'Bot', value: member.user.bot.toString(), inline: true },
      { name: 'User Id', value: member.id, inline: true },
      { name: 'Highest Rank', value: member.roles.highest.toString(), inline: true },
      { name: 'Created', value: accountCreated, inline: true },
      { name: 'Joined', value: accountJoined, inline: true },
    ]);
  message.channel.send({ embeds: [embed] });
}

async function userProfileEmbed(message: Message, user: User) {
  const accountCreated = `${message.author.createdAt.toString().substring(0, 16)}(${daysAgo(user.createdTimestamp)})`;
  const embed = new MessageEmbed()
    .setTitle('User Profile')
    .setDescription(`User data for ${user}:`)
    .setColor(randomColor)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addFields([
      { name: 'Username', value: user.tag, inline: true },
      { name: 'Discriminator', value: user.discriminator, inline: true },
      { name: 'Bot', value: user.bot.toString(), inline: true },
      { name: 'User Id', value: user.id, inline: true },
      { name: 'Created', value: accountCreated, inline: true },
    ]);
  message.channel.send({ embeds: [embed] });
}

function daysAgo(date: Date | number) {
  const msToDays = 1000 * 60 * 60 * 24;
  return `${Math.round((Date.now() - (date as number)) / msToDays)} days ago`;
}
