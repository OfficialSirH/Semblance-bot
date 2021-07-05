import { Message, MessageEmbed } from 'discord.js';
import { randomColor, msToTime } from '@semblance/constants';
import { Reminder } from '@semblance/models';
import { Semblance } from '../structures';
import { ReminderFormat } from '../models/Reminder';
import config from '@semblance/config';
const { prefix } = config;

module.exports = {
	description: "Set a reminder for yourself.",
	category: 'utility',
	usage: {
		"<time(minutes)> <reminder>": ""
	},
	examples: {
		"exampleOne": `${prefix}remindme 60 I've got magical stuff to do in 1 hour!`
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 1
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let timeAmount = /(?:(?<days>\d{1,2})d)?(?:(?<hours>\d{1,2})h)?(?:(?<minutes>\d{1,2})m)?/i.exec(args[0]);
	if (timeAmount == null) return message.reply("Your input for time is invalid, please try again.").then(msg => setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000)); 
	const { groups: { days = 0, hours = 0, minutes = 0 }} = timeAmount as unknown as TimeLengths;
	if ([days, hours, minutes].every(time => !time)) return message.reply("Your input for time was invalid, please try again.").then(msg => setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000));

	let reminder = args.splice(1, args.length);
	
	let totalTime = (days * 1000 * 3600 * 24) + (hours * 1000 * 3600) + (minutes * 1000 * 60);

	if (totalTime > 2419200000) return message.reply("You cannot create a reminder for longer than 28 days/a month");
	let embed = new MessageEmbed()
		.setTitle("Reminder")
		.setColor(randomColor)
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setThumbnail(message.author.displayAvatarURL())
		.setDescription(`I'll remind you in ${msToTime(totalTime)} for your reminder \n **Reminder**: ${reminder.join(" ")}`);
	message.channel.send({ embeds: [embed] });
	let reminderHandler: ReminderFormat;
	if (reminder.length == 0) reminderHandler = new Reminder({ userId: message.author.id, reminder: "A random reminder", remind: Date.now() + totalTime });
	else reminderHandler = new Reminder({ userId: message.author.id, reminder: reminder.join(" "), remind: Date.now() + totalTime });
	await reminderHandler.save();
}

interface TimeLengths {
	groups: {
		days: number;
		hours: number;
		minutes: number;
	}
}