import { formattedDate, randomColor } from '#lib/utilities/index';
import { handleReminder } from '#lib/utilities/models';
import { EmbedBuilder } from '@discordjs/builders';
import {
	type APIApplicationCommandAutocompleteInteraction,
	type APIChatInputApplicationCommandGuildInteraction,
	ApplicationCommandOptionType,
	MessageFlags,
	type RESTPostAPIApplicationCommandsJSONBody
} from '@discordjs/core';
import type { Prisma, Reminder } from '@prisma/client';
import type { AutocompleteInteractionArguments, Command } from '@skyra/http-framework';
import type { FastifyReply } from 'fastify';
import { scheduleJob } from 'node-schedule';

const MAX_TIME = 29030400000;
const MAX_REMINDERS = 5;
const MILLISECONDS_TO_MINUTES = 1000 * 60;

export default class UserCommand extends Command {
	public override async autocompleteRun(
		reply: FastifyReply,
		_interaction: APIApplicationCommandAutocompleteInteraction,
		options: InteractionOptionResolver
	) {
		const focusedOption = options.getFocused() as number;
		const inputtedAmount = focusedOption < 1 ? 1 : focusedOption;

		await this.client.api.interactions.autocomplete(reply, [
			{
				name: `${inputtedAmount} minute(s)`,
				value: inputtedAmount
			},
			{
				name: `${inputtedAmount} hour(s)`,
				value: inputtedAmount * 60
			},
			{
				name: `${inputtedAmount} day(s)`,
				value: inputtedAmount * 60 * 24
			},
			{
				name: `${inputtedAmount} week(s)`,
				value: inputtedAmount * 60 * 24 * 7
			},
			{
				name: `${inputtedAmount} month(s)`,
				value: inputtedAmount * 60 * 24 * 30
			}
		]);
	}

	public override data() {
		const reminderIdChoices = [
			{
				name: '5',
				value: 5
			},
			{
				name: '4',
				value: 4
			},
			{
				name: '3',
				value: 3
			},
			{
				name: '2',
				value: 2
			},
			{
				name: '1',
				value: 1
			}
		];
		return {
			command: {
				name: this.name,
				description: this.description,
				options: [
					{
						name: 'create',
						description: 'create a reminder',
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: 'amount',
								description: 'the amount of time to wait before the reminder',
								type: ApplicationCommandOptionType.Integer,
								autocomplete: true,
								required: true
							},
							{
								name: 'content',
								description: 'the content to be sent',
								type: ApplicationCommandOptionType.String,
								required: true
							}
						]
					},
					{
						name: 'edit',
						description: 'edit a reminder',
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: 'reminderid',
								description: 'the id of the reminder to edit',
								type: ApplicationCommandOptionType.Integer,
								choices: reminderIdChoices,
								required: true
							},
							{
								name: 'amount',
								description: 'the amount of time to wait before the reminder',
								type: ApplicationCommandOptionType.Integer,
								autocomplete: true
							},
							{
								name: 'content',
								description: 'the content to be sent',
								type: ApplicationCommandOptionType.String
							}
						]
					},
					{
						name: 'delete',
						description: 'delete a reminder',
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: 'reminderid',
								description: 'the id of the reminder to delete',
								type: ApplicationCommandOptionType.Integer,
								choices: reminderIdChoices,
								required: true
							}
						]
					},
					{
						name: 'list',
						description: 'list all of your reminders',
						type: ApplicationCommandOptionType.Subcommand
					}
				]
			} satisfies RESTPostAPIApplicationCommandsJSONBody
		};
	}

	async create(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction, options: InteractionOptionResolver) {
		const timeAmount = options.getInteger('amount', true) * MILLISECONDS_TO_MINUTES;
		const reminder = options.getString('reminder', true);
		const { user } = interaction.member;

		if (timeAmount > MAX_TIME)
			return interaction.reply(res, {
				content: 'You cannot create a reminder for longer than a year',
				flags: MessageFlags.Ephemeral
			});

		const currentReminderData = await this.client.db.reminder.findUnique({ where: { userId: user.id } });
		if (currentReminderData && currentReminderData?.reminders.length >= MAX_REMINDERS)
			return interaction.reply(res, {
				content: `You cannot have more than ${MAX_REMINDERS} reminders at a time`,
				flags: MessageFlags.Ephemeral
			});

		const embed = new EmbedBuilder()
			.setTitle('Reminder')
			.setColor(randomColor)
			.setDescription(`New reminder successfully created:\n**When:** ${formattedDate(Date.now() + timeAmount)}\n **Reminder**: ${reminder}`);
		await interaction.reply(res, { embeds: [embed.toJSON()] });

		if (currentReminderData) {
			this.client.db.reminder.update({
				where: { userId: user.id },
				data: {
					reminders: currentReminderData.reminders.concat([
						{
							message: reminder,
							time: Date.now() + timeAmount,
							reminderId: currentReminderData.reminders.length + 1,
							channelId: interaction.channel.id
						}
					]) as Prisma.InputJsonValue[]
				}
			});
			return scheduleJob(new Date((currentReminderData.reminders.at(-1) as unknown as UserReminder).time), () =>
				handleReminder(
					this.client,
					currentReminderData as unknown as Reminder,
					currentReminderData.reminders.at(-1) as unknown as UserReminder
				)
			);
		}

		const newReminder = await this.client.db.reminder.create({
			data: {
				userId: user.id,
				reminders: [
					{
						message: reminder,
						time: Date.now() + timeAmount,
						reminderId: 1,
						channelId: interaction.channel_id
					}
				]
			}
		});
		scheduleJob(new Date((newReminder.reminders.at(0) as unknown as UserReminder).time), () =>
			handleReminder(this.client, newReminder as unknown as Reminder, newReminder.reminders.at(0) as unknown as UserReminder)
		);
	}

	async edit(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction, options: InteractionOptionResolver) {
		const { user } = interaction.member;
		const currentReminderData = (await this.client.db.reminder.findUnique({
			where: { userId: user.id }
		})) as unknown as Reminder;

		if (!currentReminderData)
			return interaction.reply(res, {
				content: "You don't have any reminders to edit.",
				flags: MessageFlags.Ephemeral
			});

		const reminderId = options.getInteger('reminderid', true);
		const reminder = options.getString('reminder');
		const amount = options.getInteger('amount') || 0 * MILLISECONDS_TO_MINUTES;

		if (!reminder && !amount)
			return interaction.reply(res, {
				content: 'You must specify either a reminder or an amount of time to apply an edit.',
				flags: MessageFlags.Ephemeral
			});
		if (reminderId > currentReminderData.reminders.length)
			return interaction.reply(res, {
				content: 'You must specify a valid reminder ID',
				flags: MessageFlags.Ephemeral
			});

		const updatedReminder = {} as UserReminder;

		updatedReminder.message = reminder ? reminder : currentReminderData.reminders[reminderId - 1].message;
		updatedReminder.time = amount ? new Date(Date.now() + amount) : currentReminderData.reminders[reminderId - 1].time;
		updatedReminder.reminderId = reminderId;
		updatedReminder.channelId = currentReminderData.reminders.find((r) => r.reminderId === reminderId)?.channelId as string;

		const updatedReminderData = await this.client.db.reminder.update({
			where: { userId: user.id },
			data: {
				reminders: currentReminderData.reminders.map((reminder) => {
					return (reminder.reminderId == reminderId ? updatedReminder : reminder) as object;
				})
			}
		});

		if (!updatedReminderData)
			return interaction.reply(res, {
				content: 'An error occurred while updating your reminder',
				flags: MessageFlags.Ephemeral
			});

		const embed = new EmbedBuilder()
			.setTitle('Edited Reminder')
			.setColor(randomColor)
			.setDescription(
				`Reminder successfully edited:\n**When:** ${formattedDate(updatedReminder.time.valueOf())}\n **Reminder**: ${updatedReminder.message}`
			);
		await interaction.reply(res, { embeds: [embed.toJSON()] });
	}

	async deleteReminder(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction, options: InteractionOptionResolver) {
		const { user } = interaction.member;
		const reminderId = options.getInteger('reminderid', true);
		const currentReminderData = (await this.client.db.reminder.findUnique({
			where: { userId: user.id }
		})) as unknown as Reminder;

		if (!currentReminderData)
			return interaction.reply(res, {
				content: "You don't have any reminders to delete.",
				flags: MessageFlags.Ephemeral
			});
		if (reminderId > currentReminderData.reminders.length)
			return interaction.reply(res, {
				content: 'You must specify a valid reminder ID',
				flags: MessageFlags.Ephemeral
			});

		const deletedReminder = currentReminderData.reminders.find((reminder) => reminder.reminderId == reminderId) as UserReminder;
		if (currentReminderData.reminders.length == 1) await this.client.db.reminder.delete({ where: { userId: user.id } });
		else
			await this.client.db.reminder.update({
				where: { userId: user.id },
				data: {
					reminders: currentReminderData.reminders
						.filter((reminder) => reminder.reminderId != reminderId)
						.map((reminder, index) => {
							reminder.reminderId = index + 1;
							return reminder as object;
						})
				}
			});

		const embed = new EmbedBuilder()
			.setTitle('Deleted Reminder')
			.setColor(randomColor)
			.setDescription(`Your reminder to remind you about: ${deletedReminder.message}\n has been deleted successfully`);
		await interaction.reply(res, { embeds: [embed.toJSON()] });
	}

	async list(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
		const { user } = interaction.member;
		const currentReminderData = (await this.client.db.reminder.findUnique({
			where: { userId: user.id }
		})) as unknown as Reminder;

		if (!currentReminderData)
			return interaction.reply(res, {
				content: "You don't have any reminders.",
				flags: MessageFlags.Ephemeral
			});

		const embed = new EmbedBuilder()
			.setTitle('Reminder List')
			.setColor(randomColor)
			.setDescription(
				currentReminderData.reminders
					.map(
						(reminder) =>
							`**Reminder ID:** ${reminder.reminderId}\n**When:** ${formattedDate(
								reminder.time.valueOf()
							)}\n**Reminder:** ${reminder.message}`
					)
					.join('\n\n')
			);
		await interaction.reply(res, { embeds: [embed.toJSON()], flags: MessageFlags.Ephemeral });
	}
}

type AutoCompleteOptions = AutocompleteInteractionArguments<{ amount: string }>;

interface CreateOptions {
	content: string;
	amount: number;
}

interface UpdateOptions extends IdOptions {
	content?: string;
	amount?: string;
}

interface IdOptions {
	id: string;
}
