import { formattedDate, randomColor } from '#lib/utilities/index';
import { handleReminder } from '#lib/utilities/models';
import { EmbedBuilder } from '@discordjs/builders';
import { MessageFlags } from '@discordjs/core';
import type { Reminder } from '@prisma/client';
import { err, ok, Result } from '@sapphire/result';
import { isNullish } from '@sapphire/utilities';
import { type AutocompleteInteractionArguments, Command, RegisterCommand, RegisterSubcommand } from '@skyra/http-framework';
import { ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';
import { scheduleJob } from 'node-schedule';

const MAX_TIME = 29030400000;
const MAX_REMINDERS = 5;
const MILLISECONDS_TO_MINUTES = 1000 * 60;
const REMINDER_ID_CHOICES = [1, 2, 3, 4, 5].map((id) => ({ name: id.toString(), value: id }));

@RegisterCommand((builder) =>
	builder
		.setName('reminder')
		.setDescription('Create, edit, delete, or list reminders')
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
		.setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
)
export default class UserCommand extends Command {
	public override async autocompleteRun(interaction: Command.AutocompleteInteraction, options: AutoCompleteOptions) {
		const amount = Math.max(options.amount, 1);

		return interaction.reply({
			choices: [
				{
					name: `${amount} minute(s)`,
					value: amount
				},
				{
					name: `${amount} hour(s)`,
					value: amount * 60
				},
				{
					name: `${amount} day(s)`,
					value: amount * 60 * 24
				},
				{
					name: `${amount} week(s)`,
					value: amount * 60 * 24 * 7
				},
				{
					name: `${amount} month(s)`,
					value: amount * 60 * 24 * 30
				}
			]
		});
	}

	// TODO: write out the command data onto the sub command decorators
	// public override data() {
	// 	return {
	// 		command: {
	// 			name: this.name,
	// 			description: this.description,
	// 			options: [
	// 				{
	// 					name: 'create',
	// 					description: 'create a reminder',
	// 					type: ApplicationCommandOptionType.Subcommand,
	// 					options: [
	// 						{
	// 							name: 'amount',
	// 							description: 'the amount of time to wait before the reminder',
	// 							type: ApplicationCommandOptionType.Integer,
	// 							autocomplete: true,
	// 							required: true
	// 						},
	// 						{
	// 							name: 'content',
	// 							description: 'the content to be sent',
	// 							type: ApplicationCommandOptionType.String,
	// 							required: true
	// 						}
	// 					]
	// 				},
	// 				{
	// 					name: 'edit',
	// 					description: 'edit a reminder',
	// 					type: ApplicationCommandOptionType.Subcommand,
	// 					options: [
	// 						{
	// 							name: 'reminderid',
	// 							description: 'the id of the reminder to edit',
	// 							type: ApplicationCommandOptionType.Integer,
	// 							choices: REMINDER_ID_CHOICES,
	// 							required: true
	// 						},
	// 						{
	// 							name: 'amount',
	// 							description: 'the amount of time to wait before the reminder',
	// 							type: ApplicationCommandOptionType.Integer,
	// 							autocomplete: true
	// 						},
	// 						{
	// 							name: 'content',
	// 							description: 'the content to be sent',
	// 							type: ApplicationCommandOptionType.String
	// 						}
	// 					]
	// 				},
	// 				{
	// 					name: 'delete',
	// 					description: 'delete a reminder',
	// 					type: ApplicationCommandOptionType.Subcommand,
	// 					options: [
	// 						{
	// 							name: 'reminderid',
	// 							description: 'the id of the reminder to delete',
	// 							type: ApplicationCommandOptionType.Integer,
	// 							choices: REMINDER_ID_CHOICES,
	// 							required: true
	// 						}
	// 					]
	// 				},
	// 				{
	// 					name: 'list',
	// 					description: 'list all of your reminders',
	// 					type: ApplicationCommandOptionType.Subcommand
	// 				}
	// 			]
	// 		} satisfies RESTPostAPIApplicationCommandsJSONBody
	// 	};
	// }

	@RegisterSubcommand((builder) =>
		builder
			.setName('create')
			.setDescription('Create a reminder')
			.addNumberOption((option) =>
				option.setName('amount').setDescription('The amount of time to wait before the reminder').setRequired(true).setAutocomplete(true)
			)
			.addStringOption((option) => option.setName('content').setDescription('The content to be sent').setRequired(true))
	)
	public async create(interaction: Command.ChatInputInteraction, options: CreateOptions) {
		const amount = options.amount * MILLISECONDS_TO_MINUTES;
		const { content } = options;
		const userId = interaction.user.id;

		if (amount > MAX_TIME)
			return interaction.reply({
				content: 'You cannot create a reminder for longer than a year',
				flags: MessageFlags.Ephemeral
			});

		let userRemindersMetadataResult: Result<Reminder, string> = (
			await Result.fromAsync(this.container.prisma.reminder.findUnique({ where: { userId } }))
		)
			.mapErr(() => 'An error occurred while fetching your reminders')
			.mapInto((value) => (isNullish(value) ? err('No reminders found') : ok(value)));

		if (userRemindersMetadataResult.isOkAnd((value) => value.reminders.length >= MAX_REMINDERS))
			return interaction.reply({
				content: `You cannot have more than ${MAX_REMINDERS} reminders at a time`,
				flags: MessageFlags.Ephemeral
			});

		const time = new Date(Date.now() + amount);
		const channelId = interaction.channel.id;

		userRemindersMetadataResult = (
			await Result.fromAsync(
				this.container.prisma.reminder.upsert({
					where: { userId },
					update: {
						reminders: {
							push: {
								message: content,
								time,
								reminderId: userRemindersMetadataResult.unwrap().reminders.length + 1,
								channelId
							}
						}
					},
					create: {
						userId,
						reminders: {
							set: [
								{
									message: content,
									time,
									reminderId: 1,
									channelId
								}
							]
						}
					}
				})
			)
		)
			.mapErr(() => 'An error occurred while fetching your reminders')
			.mapInto((value) => (isNullish(value) ? err('An error occurred while creating the reminder') : ok(value)));

		if (userRemindersMetadataResult.isErr()) {
			return interaction.reply({
				content: userRemindersMetadataResult.unwrapErr(),
				flags: MessageFlags.Ephemeral
			});
		}

		scheduleJob(time, () => {
			void handleReminder(this.container.client, userRemindersMetadataResult.unwrap(), userRemindersMetadataResult.unwrap().reminders.at(-1));
		});

		const embed = new EmbedBuilder()
			.setTitle('Reminder')
			.setColor(randomColor)
			.setDescription(`New reminder successfully created:\n**When:** ${formattedDate(time.getTime())}\n **Reminder**: ${content}`);
		return interaction.reply({ embeds: [embed.toJSON()] });

		// if (userRemindersMetadata) {
		// 	await this.container.prisma.reminder.update({
		// 		where: { userId },
		// 		data: {
		// 			reminders: userRemindersMetadata.reminders.concat([
		// 				{
		// 					message: content,
		// 					time: new Date(Date.now() + amount),
		// 					reminderId: userRemindersMetadata.reminders.length + 1,
		// 					channelId: interaction.channel.id
		// 				}
		// 			])
		// 		}
		// 	});
		// 	return scheduleJob(new Date(userRemindersMetadata.reminders.at(-1)?.time), () =>
		// 		handleReminder(
		// 			this.client,
		// 			userRemindersMetadata as unknown as Reminder,
		// 			userRemindersMetadata.reminders.at(-1) as unknown as UserReminder
		// 		)
		// 	);
		// }

		// const newReminder = await this.container.prisma.reminder.create({
		// 	data: {
		// 		userId,
		// 		reminders: [
		// 			{
		// 				message: reminder,
		// 				time: Date.now() + amount,
		// 				reminderId: 1,
		// 				channelId: interaction.channel_id
		// 			}
		// 		]
		// 	}
		// });
		// scheduleJob(new Date((newReminder.reminders.at(0) as unknown as UserReminder).time), () =>
		// 	handleReminder(this.client, newReminder as unknown as Reminder, newReminder.reminders.at(0) as unknown as UserReminder)
		// );
	}

	public async edit(interaction: Command.ChatInputInteraction, options: UpdateOptions) {
		const { user } = interaction.member;
		const currentReminderData = (await this.container.prisma.reminder.findUnique({
			where: { userId }
		})) as unknown as Reminder;

		if (!currentReminderData)
			return interaction.reply({
				content: "You don't have any reminders to edit.",
				flags: MessageFlags.Ephemeral
			});

		const reminderId = options.getInteger('reminderid', true);
		const reminder = options.getString('reminder');
		const amount = options.getInteger('amount') || 0 * MILLISECONDS_TO_MINUTES;

		if (!reminder && !amount)
			return interaction.reply({
				content: 'You must specify either a reminder or an amount of time to apply an edit.',
				flags: MessageFlags.Ephemeral
			});
		if (reminderId > currentReminderData.reminders.length)
			return interaction.reply({
				content: 'You must specify a valid reminder ID',
				flags: MessageFlags.Ephemeral
			});

		const updatedReminder = {} as UserReminder;

		updatedReminder.message = reminder ? reminder : currentReminderData.reminders[reminderId - 1].message;
		updatedReminder.time = amount ? new Date(Date.now() + amount) : currentReminderData.reminders[reminderId - 1].time;
		updatedReminder.reminderId = reminderId;
		updatedReminder.channelId = currentReminderData.reminders.find((r) => r.reminderId === reminderId)?.channelId as string;

		const updatedReminderData = await this.container.prisma.reminder.update({
			where: { userId },
			data: {
				reminders: currentReminderData.reminders.map((reminder) => {
					return (reminder.reminderId == reminderId ? updatedReminder : reminder) as object;
				})
			}
		});

		if (!updatedReminderData)
			return interaction.reply({
				content: 'An error occurred while updating your reminder',
				flags: MessageFlags.Ephemeral
			});

		const embed = new EmbedBuilder()
			.setTitle('Edited Reminder')
			.setColor(randomColor)
			.setDescription(
				`Reminder successfully edited:\n**When:** ${formattedDate(updatedReminder.time.valueOf())}\n **Reminder**: ${updatedReminder.message}`
			);
		await interaction.reply({ embeds: [embed.toJSON()] });
	}

	public async deleteReminder(interaction: Command.ChatInputInteraction, options: IdOptions) {
		const { user } = interaction.member;
		const reminderId = options.getInteger('reminderid', true);
		const currentReminderData = (await this.container.prisma.reminder.findUnique({
			where: { userId }
		})) as unknown as Reminder;

		if (!currentReminderData)
			return interaction.reply({
				content: "You don't have any reminders to delete.",
				flags: MessageFlags.Ephemeral
			});
		if (reminderId > currentReminderData.reminders.length)
			return interaction.reply({
				content: 'You must specify a valid reminder ID',
				flags: MessageFlags.Ephemeral
			});

		const deletedReminder = currentReminderData.reminders.find((reminder) => reminder.reminderId == reminderId) as UserReminder;
		if (currentReminderData.reminders.length === 1) await this.container.prisma.reminder.delete({ where: { userId } });
		else
			await this.container.prisma.reminder.update({
				where: { userId },
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
		await interaction.reply({ embeds: [embed.toJSON()] });
	}

	public async list(interaction: Command.ChatInputInteraction) {
		const { user } = interaction.member;
		const currentReminderData = (await this.container.prisma.reminder.findUnique({
			where: { userId }
		})) as unknown as Reminder;

		if (!currentReminderData)
			return interaction.reply({
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
		await interaction.reply({ embeds: [embed.toJSON()], flags: MessageFlags.Ephemeral });
	}
}

type AutoCompleteOptions = AutocompleteInteractionArguments<{ amount: number }>;

interface CreateOptions {
	content: string;
	amount: number;
}

interface UpdateOptions extends IdOptions {
	content?: string;
	amount?: number;
}

interface IdOptions {
	id: string;
}
