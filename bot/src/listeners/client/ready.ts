import { Events, Listener, type SapphireClient } from '@sapphire/framework';
import * as schedule from 'node-schedule';
import { isProduction } from '#constants/index';
import { handleBoosterReward, handleReminder } from '#constants/models';
import type { BoosterReward, Reminder } from '@prisma/client';

export default class Ready extends Listener<typeof Events.ClientReady> {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.ClientReady,
      once: true,
    });
  }

  public override async run(client: SapphireClient) {
    client.logger.info('Bot service is now running.');

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
