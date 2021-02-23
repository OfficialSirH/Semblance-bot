const { MessageEmbed } = require('discord.js'),
	randomColor = require("../constants/colorRandomizer.js"),
	msToTime = require('../constants/msToTime.js'),
	Reminder = require('../models/Reminder.js'),
	alphabet = "abcdefghijklmnopqrstuvwxyz";

module.exports = {
	description: "Set a reminder for yourself.",
	usage: {
		"<time(minutes)> <reminder>": ""
	},
	examples: {
		"exampleOne": "s!remindme 60 I've got magical stuff to do in 1 hour!"
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 1,
	checkReminders: async (client) => {
		if (!client.readyAt || !Reminder) return;
		let reminderList = await Reminder.find({});
		if (!reminderList) return;
		const userReminders = {};
		reminderList.filter((user) => Date.now() > user.remind).forEach((user) => userReminders[user.userID] = user.reminder);

		for (const [key, value] of Object.entries(userReminders)) {
			let user = await client.users.fetch(key);
			user.send(`Reminder: ${value}`);
			await Reminder.findOneAndDelete({ userID: key });
        }
    }
}

module.exports.run = async (client, message, args) => {
	let timeAmount = /(?:(?<days>\d{1,2})d)?(?:(?<hours>\d{1,2})h)?(?:(?<minutes>\d{1,2})m)?/i.exec(args[0]);
	if (timeAmount == null) return message.reply("Your input for time is invalid, please try again.").then(msg => msg.delete({ timeout:5000 })); 
	const { groups: { days = 0, hours = 0, minutes = 0 }} = timeAmount;
	if ([days, hours, minutes].every(time => !time)) return message.reply("Your input for time was invalid, please try again.").then(msg => msg.delete({ timeout: 5000 }));

	let reminder = args.splice(1, args.length);
	
	let totalTime = (days * 1000 * 3600 * 24) + (hours * 1000 * 3600) + (minutes * 1000 * 60);

	if (totalTime > 2419200000) return message.reply("You cannot create a reminder for longer than 28 days/a month");

	let userAvatar = message.author.displayAvatarURL();
	let embed = new MessageEmbed()
		.setTitle("Reminder")
		.setColor(randomColor())
		.setThumbnail(userAvatar)
		.setDescription(`I'll remind you in ${msToTime(totalTime)} for your reminder \n **Reminder**: ${reminder.join(" ")}`)
		.setFooter(`Command called by ${message.author.tag}`, userAvatar);
	message.channel.send(embed);
	if (reminder.length == 0) var reminderHandler = new Reminder({ userID: message.author.id, reminder: "A random reminder", remind: Date.now() + totalTime });
	else var reminderHandler = new Reminder({ userID: message.author.id, reminder: reminder.join(" "), remind: Date.now() + totalTime });
	await reminderHandler.save();
}