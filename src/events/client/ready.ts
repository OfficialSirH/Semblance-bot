import { Constants } from 'discord.js';
import type { Semblance } from '#structures/Semblance';
import * as schedule from 'node-schedule';
import { prefix } from '#constants/index';
import { handleBoosterReward, handleReminder } from '#constants/models';
import type { EventHandler } from '#lib/interfaces/Semblance';
import { readdir } from 'fs/promises';
import { Reminder } from '@prisma/client';
// import { Reminder } from '#models/Reminder';
// import type { ReminderFormat } from '#models/Reminder';
// import { BoosterRewards } from '#models/BoosterRewards';
const { Events } = Constants;

export default {
  name: Events.CLIENT_READY,
  once: true,
  exec: (_, client) => ready(client),
} as EventHandler<'ready'>;

export const ready = async (client: Semblance) => {
  console.log(`Logged in as ${client.user.tag}!`);

  const totalMembers = client.guilds.cache
    .map(g => g.memberCount)
    .filter(g => g)
    .reduce((total, cur) => (total += cur), 0);
  const activity = `${prefix}help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
  client.user.setActivity(activity, { type: 'WATCHING' });

  setInterval(() => {
    const totalMembers = client.guilds.cache
      .map(g => g.memberCount)
      .filter(g => g)
      .reduce((total, cur) => (total += cur), 0);
    const activity = `${prefix}help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
    if (client.user.presence.activities[0]?.name !== activity) client.user.setActivity(activity, { type: 'WATCHING' });
  }, 3600000);

  /* Slash Command setup */
  const slashCommands = await readdir('./dist/src/applicationCommands/slashCommands');
  slashCommands
    .filter(f => f.endsWith('.js'))
    .forEach(async command => {
      const commandName = command.replace('.js', '');
      client.slashCommands.set(
        commandName,
        (await import(`#src/applicationCommands/slashCommands/${commandName}`)).default,
      );
    });

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
