import { Events, Listener, type SapphireClient } from '@sapphire/framework';
import * as schedule from 'node-schedule';
import { isProduction } from '#constants/index';
import { handleBoosterReward, handleReminder } from '#constants/models';
import type { BoosterReward, Reminder } from '@prisma/client';
import { ActivityType } from 'discord.js';

export default class Ready extends Listener<typeof Events.ClientReady> {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.ClientReady,
      once: true,
    });
  }

  public override async run(client: SapphireClient) {
    client.logger.info(`Logged in as ${client.user.tag}!`);

    const totalMembers = client.guilds.cache
      .map(g => g.memberCount)
      .filter(g => g)
      .reduce((total, cur) => (total += cur), 0);
    const activity = `help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
    client.user.setActivity(activity, { type: ActivityType.Watching });

    if (isProduction) {
      /* Reminder scheduling */
      const reminders = (await client.db.reminder.findMany({})) as unknown as Reminder[];
      reminders.forEach(reminderData => {
        reminderData.reminders.forEach(reminder => {
          schedule.scheduleJob(reminder.time, () => handleReminder(client, reminderData, reminder));
        });
      });

      /* Booster rewards scheduling */
      const boosterRewards = await client.db.boosterReward.findMany({});
      const dueBoosterRewards: Promise<BoosterReward>[] = [];

      boosterRewards
        .filter(boosterReward => {
          if (boosterReward.rewardingDate.getTime() <= Date.now()) {
            dueBoosterRewards.push(handleBoosterReward(client, boosterReward));
            return false;
          }
          return true;
        })
        .forEach(boosterReward => {
          schedule.scheduleJob(
            boosterReward.rewardingDate,
            async () => await handleBoosterReward(client, boosterReward),
          );
        });

      await Promise.all(dueBoosterRewards);
    }
  }
}
