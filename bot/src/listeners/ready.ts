import * as schedule from 'node-schedule';
import { isProduction } from '#constants/index';
import { handleBoosterReward, handleReminder } from '#constants/models';
import type { BoosterReward, Reminder } from '@prisma/client';
import {
  ActivityType,
  GatewayDispatchEvents,
  GatewayOpcodes,
  type GatewayReadyDispatchData,
  PresenceUpdateStatus,
} from '@discordjs/core';
import { Listener } from '#structures/Listener';

export default class Ready extends Listener<GatewayDispatchEvents.Ready> {
  public constructor(client: Listener.Requirement) {
    super(client, {
      event: GatewayDispatchEvents.Ready,
    });
  }

  // TODO: figure out how the heck to handle unavailable guilds sent from ready event that are eventually sent as guildCreate events
  public override async run(data: GatewayReadyDispatchData) {
    this.client.logger.info('Bot service is now running.');

    if (!isProduction) {
      this.client.ws.send(0, {
        op: GatewayOpcodes.PresenceUpdate,
        d: {
          activities: [
            {
              name: 'with new experiments for the universe',
              type: ActivityType.Playing,
            },
          ],
          afk: false,
          since: null,
          status: PresenceUpdateStatus.Online,
        },
      });
      return;
    }

    const totalMembers = this.client.cache.data.guilds
      .map(g => g.approximate_member_count)
      .filter(g => g)
      .reduce<number>((total, cur) => (total += cur || 0), 0);
    const activity = `help in ${this.client.cache.data.guilds.size} servers | ${totalMembers} members`;

    this.client.ws.send(0, {
      op: GatewayOpcodes.PresenceUpdate,
      d: {
        activities: [
          {
            name: activity,
            type: ActivityType.Watching,
          },
        ],
        afk: false,
        since: null,
        status: PresenceUpdateStatus.Online,
      },
    });

    /* Reminder scheduling */
    const reminders = (await this.client.db.reminder.findMany({})) as unknown as Reminder[];
    reminders.forEach(reminderData => {
      reminderData.reminders.forEach(reminder => {
        schedule.scheduleJob(reminder.time, () => handleReminder(this.client, reminderData, reminder));
      });
    });

    /* Booster rewards scheduling */
    const boosterRewards = await this.client.db.boosterReward.findMany({});
    const dueBoosterRewards: Promise<BoosterReward>[] = [];

    boosterRewards
      .filter(boosterReward => {
        if (boosterReward.rewardingDate.getTime() <= Date.now()) {
          dueBoosterRewards.push(handleBoosterReward(this.client, boosterReward));
          return false;
        }
        return true;
      })
      .forEach(boosterReward => {
        schedule.scheduleJob(
          boosterReward.rewardingDate,
          async () => await handleBoosterReward(this.client, boosterReward),
        );
      });

    await Promise.all(dueBoosterRewards);
  }
}
