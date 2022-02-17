import type { Message } from 'discord.js';
import { GuildMember } from 'discord.js';
import { formattedDate } from '#constants/index';
import { Command } from '@sapphire/framework';
import type { SapphireClient } from '@sapphire/framework';

export default {
  description: 'interact with booster rewards for users',
  category: 'developer',
  permissionRequired: 7,
  aliases: ['boosterrewards', 'brewards'],
  checkArgs: args => args.length >= 1,
  run: (client, message, args) => run(client, message, args),
} as Command<'developer'>;

const run = async (client: SapphireClient, message: Message, args: string[]) => {
  if (!args.length)
    return message.reply(
      'The following options are:\n`list`\n`add <user id or mention>` or vice versa\n`remove <user id or mention>` or vice versa',
    );
  if (args.includes('list')) return listBoosters(client, message);

  const user = message.mentions.members.first();
  const userId = user ? user.id : args.filter(a => a.match(/^<@!?\d{16,19}>$/)).shift();
  if (!user && !userId) return message.reply('You must refer to a user by ID or mention');

  if (args.includes('add')) return addBooster(client, message, userId);
  if (args.includes('remove')) return removeBooster(client, message, userId);
};

const addBooster = async (client: SapphireClient, message: Message, user: string | GuildMember) => {
  const userId = user instanceof GuildMember ? user.id : user;

  let boosterRewards = await client.db.boosterReward.findUnique({ where: { userId } });
  if (boosterRewards)
    return message.reply(
      `That user is already listed to receive an automated reward on ${formattedDate(
        boosterRewards.rewardingDate.valueOf(),
      )}`,
    );

  boosterRewards = await client.db.boosterReward.create({
    data: {
      userId,
      rewardingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    },
  });
  message.reply(
    `That user will now receive an automated reward on ${formattedDate(boosterRewards.rewardingDate.valueOf())}`,
  );
};

const removeBooster = async (client: SapphireClient, message: Message, user: string | GuildMember) => {
  const userId = user instanceof GuildMember ? user.id : user;
  const boosterRewards = await client.db.boosterReward.delete({ where: { userId } }).catch(() => null);
  if (!boosterRewards) return message.reply('That user is not listed to receive an automated reward');
  message.reply('That user will no longer receive an automated reward');
};

const listBoosters = async (client: SapphireClient, message: Message) => {
  const boosterRewards = await client.db.boosterReward.findMany({});
  if (!boosterRewards.length) return message.reply('There are no booster rewards to list');
  message.channel.send(
    `There are ${boosterRewards.length} booster rewards currently listed:\n${boosterRewards.reduce(
      (acc, cur) => (acc += `${cur.userId} - ${formattedDate(cur.rewardingDate.valueOf())}\n`),
      '',
    )}`,
  );
};
