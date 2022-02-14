import { ActivityType } from 'discord.js';
import { Listener, type SapphireClient } from '@sapphire/framework';
import * as schedule from 'node-schedule';
import { prefix } from '#constants/index';
import { handleBoosterReward, handleReminder } from '#constants/models';
import { readdir } from 'fs/promises';
import type { Reminder } from '@prisma/client';

export default class Ready extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      name: 'ready',
      once: true,
    });
  }

  public override async run(client: SapphireClient) {
    console.log(`Logged in as ${client.user.tag}!`);

    const totalMembers = client.guilds.cache
      .map(g => g.memberCount)
      .filter(g => g)
      .reduce((total, cur) => (total += cur), 0);
    const activity = `${prefix}help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
    client.user.setActivity(activity, { type: ActivityType.Watching });

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
  }
}
