import { Constants } from 'discord.js';
import type { SapphireClient } from '@sapphire/framework';
import * as schedule from 'node-schedule';
import { prefix } from '#constants/index';
import { handleBoosterReward, handleReminder } from '#constants/models';
import type { EventHandler } from '#lib/interfaces/Semblance';
import { readdir } from 'fs/promises';
import type { Reminder } from '@prisma/client';
const { Events } = Constants;

export default {
  name: Events.CLIENT_READY,
  once: true,
  exec: (_, client) => ready(client),
} as EventHandler<'ready'>;

export const ready = async (client: SapphireClient) => {
  console.log(`Logged in as ${client.user.tag}!`);

  const totalMembers = client.guilds.cache
    .map(g => g.memberCount)
    .filter(g => g)
    .reduce((total, cur) => (total += cur), 0);
  const activity = `${prefix}help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
  client.user.setActivity(activity, { type: 'WATCHING' });

  const infoBuilders = (await readdir('./dist/src/infoBuilders')).filter(f => f.endsWith('.js'));
  infoBuilders.forEach(async file =>
    client.infoBuilders.set(
      file.replace('.js', ''),
      (await import(`#src/infoBuilders/${file.replace('.js', '')}`)).build,
    ),
  );

  /* Reminder scheduling */
  const reminders = (await client.db.reminder.findMany({})) as unknown as Reminder[];
  reminders.forEach(reminderData => {
    reminderData.reminders.forEach(reminder => {
      schedule.scheduleJob(reminder.time, () => handleReminder(client, reminderData, reminder));
    });
  });

  /* Booster rewards scheduling */
  const boosterRewards = await client.db.boosterReward.findMany({});
  boosterRewards.forEach(boosterReward => {
    schedule.scheduleJob(boosterReward.rewardingDate, () => handleBoosterReward(client, boosterReward));
  });
};
