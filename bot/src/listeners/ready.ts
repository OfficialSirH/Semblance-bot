import * as schedule from 'node-schedule';
import { GuildId, isProduction } from '#constants/index';
import { handleBoosterReward, handleReminder } from '#constants/models';
import type { BoosterReward, Reminder } from '@prisma/client';
import {
	ActivityType,
	GatewayDispatchEvents,
	GatewayOpcodes,
	type GatewayReadyDispatchData,
	PresenceUpdateStatus,
	Routes,
	type APIRole,
	type APIApplicationCommand
} from '@discordjs/core';
import { Listener } from '#structures/Listener';
import { Collection } from '@discordjs/collection';

export default class Ready extends Listener<GatewayDispatchEvents.Ready> {
	public constructor(client: Listener.Requirement) {
		super(client, {
			event: GatewayDispatchEvents.Ready
		});
	}

	// TODO: figure out how the heck to handle unavailable guilds sent from ready event that are eventually sent as guildCreate events
	public override async run(data: GatewayReadyDispatchData) {
		this.client.logger.info('Bot service is now running.');

		for (const guild of data.guilds) {
			this.client.cache.data.guilds.set(guild.id, guild);
		}

		this.client.cache.data.cellsRoles = new Collection(
			((await this.client.rest.get(Routes.guildRoles(GuildId.cellToSingularity))) as APIRole[]).map((role) => [role.id, role]) as [
				string,
				APIRole
			][]
		);

		// cache application commands
		this.client.cache.data.applicationCommands = new Collection(
			((await this.client.rest.get(Routes.applicationCommands(this.client.user.id))) as APIApplicationCommand[]).map((command) => [
				command.id,
				command
			]) as [string, APIApplicationCommand][]
		);
		// append to the application command cache with guild-specific application commands from cellToSingularity and sirhStuff
		this.client.cache.data.applicationCommands = this.client.cache.data.applicationCommands.concat(
			new Collection(
				(
					(await this.client.rest.get(
						Routes.applicationGuildCommands(this.client.user.id, GuildId.cellToSingularity)
					)) as APIApplicationCommand[]
				).map((command) => [command.id, command]) as [string, APIApplicationCommand][]
			)
		);
		this.client.cache.data.applicationCommands = this.client.cache.data.applicationCommands.concat(
			new Collection(
				(
					(await this.client.rest.get(Routes.applicationGuildCommands(this.client.user.id, GuildId.sirhStuff))) as APIApplicationCommand[]
				).map((command) => [command.id, command]) as [string, APIApplicationCommand][]
			)
		);

		if (!isProduction) {
			this.client.ws.send(0, {
				op: GatewayOpcodes.PresenceUpdate,
				d: {
					activities: [
						{
							name: 'with new experiments for the universe',
							type: ActivityType.Playing
						}
					],
					afk: false,
					since: null,
					status: PresenceUpdateStatus.Online
				}
			});
			return;
		}

		this.client.ws.send(0, {
			op: GatewayOpcodes.PresenceUpdate,
			d: {
				activities: [
					{
						name: 'with current experiments for the universe',
						type: ActivityType.Playing
					}
				],
				afk: false,
				since: null,
				status: PresenceUpdateStatus.Online
			}
		});

		/* Reminder scheduling */
		const reminders = (await this.client.db.reminder.findMany({})) as unknown as Reminder[];
		reminders.forEach((reminderData) => {
			reminderData.reminders.forEach((reminder) => {
				schedule.scheduleJob(reminder.time, () => handleReminder(this.client, reminderData, reminder));
			});
		});

		/* Booster rewards scheduling */
		const boosterRewards = await this.client.db.boosterReward.findMany({});
		const dueBoosterRewards: Promise<BoosterReward>[] = [];

		boosterRewards
			.filter((boosterReward) => {
				if (boosterReward.rewardingDate.getTime() <= Date.now()) {
					dueBoosterRewards.push(handleBoosterReward(this.client, boosterReward));
					return false;
				}
				return true;
			})
			.forEach((boosterReward) => {
				schedule.scheduleJob(boosterReward.rewardingDate, async () => await handleBoosterReward(this.client, boosterReward));
			});

		await Promise.all(dueBoosterRewards);
	}
}
