import { MessageEmbed, CommandInteraction, User, CommandInteractionOption, Collection, Util } from 'discord.js';
import { Reminder } from '@semblance/models';
import { randomColor, msToTime, timeInputRegex, formattedDate, timeInputToMs } from '@semblance/constants';
import { Semblance } from '@semblance/structures';
import { TimeLengths } from '@semblance/lib/interfaces/remindme';
import { UserReminder } from '../models/Reminder';

module.exports = {
    permissionRequired: 0,
    run: async (client: Semblance, interaction: CommandInteraction) => {
		const actions = interaction.options.filter(o => o.type == 'SUB_COMMAND');
		if (actions.has('create')) return create(client, interaction, actions.get('create').options);
		if (actions.has('edit')) return edit(client, interaction, actions.get('edit').options);
		if (actions.has('delete')) return deleteReminder(client, interaction, actions.get('delete').options);
		if (actions.has('list')) return list(client, interaction);
		return interaction.reply({ content: "You didn't provide any valid options.", ephemeral: true });
    }
}

async function create(client: Semblance, interaction: CommandInteraction, options: Collection<string, CommandInteractionOption>) {
		const timeAmount = timeInputRegex.exec(options.get('length').value as string),
        reminder = Util.removeMentions(options.get('reminder').value as string),
        user = interaction.member.user as User;

	if (timeAmount == null) return interaction.reply({ content: 'Your input for time is invalid, please try again.', ephemeral: true });
	const { groups: { months = 0, weeks = 0, days = 0, hours = 0, minutes = 0 }} = timeAmount as unknown as TimeLengths;
	if ([months, weeks, days, hours, minutes].every(time => !time)) return interaction.reply({ content: 'Your input for time was invalid, please try again.', ephemeral: true });

	let totalTime = timeInputToMs(months, weeks, days, hours, minutes);

	if (totalTime > 29030400000) return interaction.reply({ content: "You cannot create a reminder for longer than a year", ephemeral: true });

	let currentReminderData = await Reminder.findOne({ userId: user.id });
	if (currentReminderData?.reminders.length >= 5) return interaction.reply({ content: "You cannot have more than 5 reminders at a time", ephemeral: true });

	let embed = new MessageEmbed()
		.setTitle("Reminder")
		.setColor(randomColor)
		.setThumbnail(user.displayAvatarURL())
		.setDescription(`New reminder successfully created:\n**When:** ${formattedDate(Date.now() + totalTime)}\n **Reminder**: ${reminder}`)
		.setFooter(`Command called by ${user.tag}`, user.displayAvatarURL());
	await interaction.reply({ embeds: [embed] });

	if (!!currentReminderData) return currentReminderData.update({ reminders: currentReminderData.reminders.concat([{ 
		message: reminder, 
		time: Date.now() + totalTime,
		reminderId: currentReminderData.reminders.length+1,
		channelId: interaction.channel.id
	}]) });

	let reminderHandler = new Reminder({ 
		userId: user.id, 
		reminders: [{
			message: reminder,
			time: Date.now() + totalTime,
			reminderId: 1,
			channelId: interaction.channel.id
		}]
	});
	await reminderHandler.save();
}

async function edit(client: Semblance, interaction: CommandInteraction, options: Collection<string, CommandInteractionOption>) {
	const user = interaction.member.user as User,
	currentReminderData = await Reminder.findOne({ userId: user.id });

	if (!currentReminderData) return interaction.reply({ content: "You don't have any reminders to edit.", ephemeral: true });

	const reminderId = options.get('reminderid').value as number,
	reminder = options.get('reminder')?.value as string,
	length = options.get('length')?.value as string;
		
	if (!reminder && !length) return interaction.reply({ content: "You must specify a reminder or a length", ephemeral: true });
	if (reminderId > currentReminderData.reminders.length) return interaction.reply({ content:"You must specify a valid reminder ID", ephemeral: true });

	let timeAmount: RegExpExecArray, totalTime = 0;
	if (length) {
		timeAmount = timeInputRegex.exec(length);
		const { groups: { months = 0, weeks = 0, days = 0, hours = 0, minutes = 0 }} = timeAmount as unknown as TimeLengths;
		if ([months, weeks, days, hours, minutes].every(time => !time)) return interaction.reply({ content: 'Your input for time was invalid, please try again.', ephemeral: true });
		totalTime = timeInputToMs(months, weeks, days, hours, minutes);
	}

	const updatedReminder = {} as UserReminder;

	updatedReminder.message = reminder ? Util.removeMentions(reminder) : Util.removeMentions(currentReminderData.reminders[reminderId - 1].message);
	if (length) updatedReminder.time = Date.now() + totalTime;
	updatedReminder.reminderId = reminderId;
	updatedReminder.channelId = currentReminderData.reminders.find(r => r.reminderId === reminderId).channelId;

	await currentReminderData.update({
		reminders: currentReminderData.reminders.map(reminder => {
			return reminder.reminderId == reminderId ? updatedReminder : reminder;
		})
	});

	let embed = new MessageEmbed()
		.setTitle("Edited Reminder")
		.setColor(randomColor)
		.setThumbnail(user.displayAvatarURL())
		.setDescription(`Reminder successfully edited:\n**When:** ${formattedDate(updatedReminder.time)}\n **Reminder**: ${updatedReminder.message}`)
		.setFooter(`Command called by ${user.tag}`, user.displayAvatarURL());
	await interaction.reply({ embeds: [embed] });
}

async function deleteReminder(client: Semblance, interaction: CommandInteraction, options: Collection<string, CommandInteractionOption>) {
	const user = interaction.member.user as User,
	reminderId = options.get('reminderid').value as number,
	currentReminderData = await Reminder.findOne({ userId: user.id });

	if (!currentReminderData) return interaction.reply({ content: "You don't have any reminders to delete.", ephemeral: true });
	if (reminderId > currentReminderData.reminders.length) return interaction.reply({ content:"You must specify a valid reminder ID", ephemeral: true });

	const deletedReminder = currentReminderData.reminders.find(reminder => reminder.reminderId == reminderId);
	if (currentReminderData.reminders.length == 1) await currentReminderData.delete();
	else await currentReminderData.update({ reminders: currentReminderData.reminders.filter(reminder => reminder.reminderId != reminderId).map((reminder, index) => {
		reminder.reminderId = index + 1;
		return reminder;
	}) });

	let embed = new MessageEmbed()
		.setTitle("Deleted Reminder")
		.setColor(randomColor)
		.setThumbnail(user.displayAvatarURL())
		.setDescription(`Your reminder to remind you about: ${deletedReminder.message}\n has been deleted successfully`)
		.setFooter(`Command called by ${user.tag}`, user.displayAvatarURL());
	await interaction.reply({ embeds: [embed] });
}

async function list(client: Semblance, interaction: CommandInteraction) {
	const user = interaction.member.user as User,
		currentReminderData = await Reminder.findOne({ userId: user.id });

	if (!currentReminderData) return interaction.reply({ content: "You don't have any reminders.", ephemeral: true });

	let embed = new MessageEmbed()
		.setTitle("Reminder List")
		.setColor(randomColor)
		.setThumbnail(user.displayAvatarURL())
		.setDescription(currentReminderData.reminders.map(reminder => `**Reminder ID:** ${reminder.reminderId}\n**When:** ${formattedDate(reminder.time)}\n**Reminder:** ${reminder.message}`).join('\n\n'))
		.setFooter(`Command called by ${user.tag}`, user.displayAvatarURL());
	await interaction.reply({ embeds: [embed] });
}