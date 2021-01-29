const { MessageEmbed } = require('discord.js'),
    randomColor = require("../constants/colorRandomizer.js"),
    msToTime = require('../constants/msToTime.js'),
    Reminder = require('../models/Reminder.js'),
    { getAvatar } = require('../constants');

module.exports = {
    permissionRequired: 0,
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
    },

    run: async (client, interaction) => {
		let timeAmount = interaction.data.options[0].value * 60 * 1000,
            reminder = interaction.data.options[1].value,
            user = interaction.member.user,
            userAvatar = getAvatar(user);

	if (msToTime(timeAmount).indexOf("e") >= 0 || msToTime(timeAmount) == "Infinityd") {
		return [{ content: "Even science itself hates the number you specified." }];
    }
    
    const reminderHandler = new Reminder({ userID: user.id, reminder: reminder, remind: Date.now() + timeAmount });
	await reminderHandler.save();

	let embed = new MessageEmbed()
		.setTitle("Reminder")
		.setColor(randomColor())
		.setThumbnail(userAvatar)
		.setDescription(`I'll remind you in ${msToTime(timeAmount)} for your reminder \n **Reminder**: ${reminder}`)
		.setFooter(`Command called by ${user.username}#${user.discriminator}`, userAvatar);
    return [{ embeds: [embed] }];
    }
}