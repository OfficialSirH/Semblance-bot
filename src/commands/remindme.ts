import { Message, MessageEmbed } from 'discord.js';
import { randomColor, formattedDate, timeInputRegex, timeInputToMs } from '@semblance/constants';
import { Reminder } from '@semblance/models';
import { Semblance } from '../structures';
import config from '@semblance/config';
import { TimeLengths } from '@semblance/lib/interfaces/remindme';
const { prefix } = config;

module.exports = {
	description: "Set a reminder for yourself.",
	category: 'utility',
	usage: {
		"<time(3M2w5d6h4m)> <reminder>": ""
	},
	examples: {
		"exampleOne": `${prefix}remindme 1h I've got magical stuff to do in 1 hour!`
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 2
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let timeAmount = timeInputRegex.exec(args[0]);
	if (timeAmount == null) return message.reply("Your input for time is invalid, please try again.").then(msg => setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000)); 
	const { groups: { months = 0, weeks = 0, days = 0, hours = 0, minutes = 0 }} = timeAmount as unknown as TimeLengths;
	if ([months, weeks, days, hours, minutes].every(time => !time)) return message.reply("Your input for time was invalid, please try again.").then(msg => setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000));

	let reminder = args.splice(1, args.length);
	let totalTime = timeInputToMs(months, weeks, days, hours, minutes);

	if (totalTime > 29030400000) return message.reply("You cannot create a reminder for longer than a year");
	const currentReminderData = await Reminder.findOne({ userId: message.author.id });
	if (currentReminderData?.reminders.length >= 5) return message.reply("You cannot have more than 5 reminders at a time");
	let embed = new MessageEmbed()
		.setTitle("Reminder")
		.setColor(randomColor)
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setThumbnail(message.author.displayAvatarURL())
		.setDescription(`New reminder successfully created:\n**When:** ${formattedDate(Date.now() + totalTime)}\n **Reminder**: ${reminder.join(" ")}`);
	message.channel.send({ embeds: [embed] });

	if (!!currentReminderData) return currentReminderData.update({ reminders: currentReminderData.reminders.concat([{ 
		message: reminder.join(" "), 
		time: Date.now() + totalTime, 
		reminderId: currentReminderData.reminders.length,
		channelId: message.channel.id
	}]) });

	let reminderHandler = new Reminder({ 
		userId: message.author.id, 
		reminders: [{
			message: reminder.join(' '),
			time: Date.now() + totalTime,
			reminderId: 1,
			channelId: message.channel.id
		}]
	});
	await reminderHandler.save();
}