const { MessageEmbed } = require('discord.js'),
	randomColor = require("../constants/colorRandomizer.js"),
	msToTime = require('../constants/msToTime.js');
var alphabet = "abcdefghijklmnopqrstuvwxyz";

module.exports = {
	description: "Set a reminder for yourself.",
	usage: {
		"<time> <reminder>": ""
	},
	examples: {
		"exampleOne": "s!remindme 1h20m30s I've got magical stuff to do in 1 hour, 20 minutes, and 30 seconds *precisely!*"
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 2
}

module.exports.run = async (client, message, args) => {
		var time = args[0];
		var timeAmount = 0;
		var specifiedTime = false;
		var h = false, m = false, s = false;
		var reminder = args.splice(1, args.length);
	for (var i = 0; i < time.length; i++) {
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
			var day = 24 * 60 * 60 * 1000;
			if (msToTime(timeAmount).indexOf("e") >= 0 || msToTime(timeAmount) == "Infinityd") {
				message.reply("Even science itself hates the number you specified.");
				message.delete();
				return;
			} else if (timeAmount > day) {
				message.reply("The max amount of time I can do is 24 hours");
				message.delete();
				return;
			}
			var userAvatar = message.author.avatarURL();
			var embed = new MessageEmbed()
				.setTitle("Reminder")
				.setColor(randomColor())
				.setThumbnail(userAvatar)
				.setDescription(`I'll remind you in ${msToTime(timeAmount)} for your reminder \n **Reminder**: ${reminder.join(" ")}`)
				.setFooter(`Command called by ${message.author.tag}`, userAvatar);
			message.channel.send(embed);
			setTimeout(() => { message.author.send(`Reminder: ${reminder.join(" ")}`); }, timeAmount);
			return;
		}
	}
}