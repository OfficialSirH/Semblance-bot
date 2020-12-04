const { MessageEmbed } = require('discord.js'),
	randomColor = require("../constants/colorRandomizer.js"),
	msToTime = require('../constants/msToTime.js'),
	Reminder = require('../models/Reminder.js'),
	alphabet = "abcdefghijklmnopqrstuvwxyz";

module.exports = {
	description: "Set a reminder for yourself.",
	usage: {
		"<time> <reminder>": ""
	},
	examples: {
		"exampleOne": "s!remindme 1h20m30s I've got magical stuff to do in 1 hour, 20 minutes, and 30 seconds *precisely!*"
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 2,
	checkReminders: async (client) => {
		if (!client.readyAt || !Reminder) return;
		let reminderList = await Reminder.find({});
		if (!reminderList) return;
		const userReminders = {};
		reminderList.filter(async (user) => Date.now() > user.remind).forEach(async (user) => userReminders[user.userID] = user.reminder);

		for (const [key, value] of Object.entries(userReminders)) {
			let user = await client.users.fetch(key);
			user.send(`Reminder: ${value}`);
			await Reminder.findOneAndDelete({ userID: key });
        }
    }
}

module.exports.run = async (client, message, args) => {
		let time = args[0];
		let timeAmount = 0;
		let specifiedTime = false;
		let h = false, m = false, s = false;
		let reminder = args.splice(1, args.length);
	for (let i = 0; i < time.length; i++) {
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
				message.delete();
				return;
			} else if (timeAmount > day) {
				message.reply("The max amount of time I can do is 24 hours");
				message.delete();
				return;
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
	}
}