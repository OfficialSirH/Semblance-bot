import type { Message } from 'discord.js';
import { GuildMember } from 'discord.js';
import { BoosterRewards } from '#models/BoosterRewards';
import { formattedDate } from '#constants/index';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'interact with booster rewards for users',
  category: 'developer',
  permissionRequired: 7,
  aliases: ['boosterrewards', 'brewards'],
  checkArgs: args => args.length >= 1,
  run: (_client, message, args) => run(message, args),
} as Command<'developer'>;

const run = async (message: Message, args: string[]) => {
  if (!args.length)
    return message.reply(
      'The following options are:\n`list`\n`add <user id or mention>` or vice versa\n`remove <user id or mention>` or vice versa',
    );
  if (args.includes('list')) return listBoosters(message);

  let user = message.mentions.members.first();
  let userId = user ? user.id : args.filter(a => a.match(/^<@!?\d{16,19}>$/)).shift();
  if (!user && !userId) return message.reply('You must refer to a user by ID or mention');

  if (args.includes('add')) return addBooster(message, userId);
  if (args.includes('remove')) return removeBooster(message, userId);
};

const addBooster = async (message: Message, user: string | GuildMember) => {
  let userId = user instanceof GuildMember ? user.id : user;

  let boosterRewards = await BoosterRewards.findOne({ userId });
  if (boosterRewards)
    return message.reply(
      `That user is already listed to receive an automated reward on ${formattedDate(boosterRewards.rewardingDate)}`,
    );

  boosterRewards = new BoosterRewards({ userId, rewardingDate: Date.now() + 1000 * 60 * 60 * 24 * 14 });
  await boosterRewards.save();
  message.reply(`That user will now receive an automated reward on ${formattedDate(boosterRewards.rewardingDate)}`);
};

const removeBooster = async (message: Message, user: string | GuildMember) => {
  let userId = user instanceof GuildMember ? user.id : user;
  let boosterRewards = await BoosterRewards.findOne({ userId });
  if (!boosterRewards) return message.reply('That user is not listed to receive an automated reward');
  await boosterRewards.remove();
  message.reply('That user will no longer receive an automated reward');
};

const listBoosters = async (message: Message) => {
  let boosterRewards = await BoosterRewards.find({});
  if (!boosterRewards.length) return message.reply('There are no booster rewards to list');
  message.channel.send(
    `There are ${boosterRewards.length} booster rewards currently listed:\n${boosterRewards.reduce(
      (acc, cur) => (acc += `${cur.userId} - ${formattedDate(cur.rewardingDate)}\n`),
      '',
    )}`,
  );
};
