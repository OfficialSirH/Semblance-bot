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
		//let time = args[0];
		if (isNaN(args[0])) return message.reply("You must use a number in your reminder's timer.").then(msg => msg.delete({ timeout: 5000 }));
		let timeAmount = args[0] * 60 * 1000;
		/*let specifiedTime = false;
		let h = false, m = false, s = false;*/
		let reminder = args.splice(1, args.length);
	/*for (let i = 0; i < time.length; i++) {
		if (alphabet.indexOf(time[i]) >= 0) {
			if (time[i] == "h" || time[i] == "m" || time[i] == "s") {
				specifiedTime = true;
				if (time[i] == "h") {
					timeAmount += parseInt(time.slice(0, time.indexOf("h"))) * 3600000;
					h = true;
				}
				if (time[i] == "m") {
					if (h) {
						timeAmount += parseInt(time.slice(time.indexOf("h") + 1, time.indexOf("m"))) * 60000;
					} else {
						timeAmount += parseInt(time.slice(0, time.indexOf("m"))) * 60000;
					}
					m = true;
				}
				if (time[i] == "s") {
					if (h && !m) {
						timeAmount += parseInt(time.slice(time.indexOf("h") + 1, time.indexOf("s"))) * 1000;
					}
					if (m) {
						timeAmount += parseInt(time.slice(time.indexOf("m") + 1, time.indexOf("s"))) * 1000;
					}
					if (!h && !m) {
						timeAmount += parseInt(time.slice(0, time.indexOf("s"))) * 1000;
					}
				}
			} else {
				return message.reply("Sorry, but your time has invalid input.");
			}
		}
		if (i == time.length - 1 && !specifiedTime) {
			message.reply("You seem to be missing some input for time.");
			return;
		} else if (i == time.length - 1 && specifiedTime) {
			let day = 24 * 60 * 60 * 1000;
			if (msToTime(timeAmount).indexOf("e") >= 0 || msToTime(timeAmount) == "Infinityd") {
				message.reply("Even science itself hates the number you specified.");
				return message.delete();
			}
			let userAvatar = message.author.avatarURL();
			let embed = new MessageEmbed()
				.setTitle("Reminder")
				.setColor(randomColor())
				.setThumbnail(userAvatar)
				.setDescription(`I'll remind you in ${msToTime(timeAmount)} for your reminder \n **Reminder**: ${reminder.join(" ")}`)
				.setFooter(`Command called by ${message.author.tag}`, userAvatar);
			message.channel.send(embed);
			if (reminder.length == 0) var reminderHandler = new Reminder({ userID: message.author.id, remind: Date.now() + timeAmount });
			else var reminderHandler = new Reminder({ userID: message.author.id, reminder: reminder.join(" "), remind: Date.now() + timeAmount });
			await reminderHandler.save();
			//setTimeout(() => { message.author.send(`Reminder: ${reminder.join(" ")}`); }, timeAmount);
		}
	}*/
	if (msToTime(timeAmount).indexOf("e") >= 0 || msToTime(timeAmount) == "Infinityd") {
		message.reply("Even science itself hates the number you specified.");
		return message.delete();
	}
	let userAvatar = message.author.avatarURL();
	let embed = new MessageEmbed()
		.setTitle("Reminder")
		.setColor(randomColor())
		.setThumbnail(userAvatar)
		.setDescription(`I'll remind you in ${msToTime(timeAmount)} for your reminder \n **Reminder**: ${reminder.join(" ")}`)
		.setFooter(`Command called by ${message.author.tag}`, userAvatar);
	message.channel.send(embed);
	if (reminder.length == 0) var reminderHandler = new Reminder({ userID: message.author.id, reminder: "A random reminder", remind: Date.now() + timeAmount });
	else var reminderHandler = new Reminder({ userID: message.author.id, reminder: reminder.join(" "), remind: Date.now() + timeAmount });
	await reminderHandler.save();
}