const { MessageEmbed } = require('discord.js'),
    Reminder = require('../models/Reminder.js').Reminder,
    { getAvatar, randomColor, msToTime } = require('../constants');

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
		let timeAmount = /(?:(?<days>\d{1,2})d)?(?:(?<hours>\d{1,2})h)?(?:(?<minutes>\d{1,2})m)?/i.exec(interaction.data.options[0].value),
            reminder = interaction.data.options[1].value,
            user = interaction.member.user;

		if (timeAmount == null) return interaction.send('Your input for time is invalid, please try again.');
		const { groups: { days = 0, hours = 0, minutes = 0 }} = timeAmount;
		if ([days, hours, minutes].every(time => !time)) return interaction.send('Your input for time was invalid, please try again.');
    
		let totalTime = (days * 1000 * 3600 * 24) + (hours * 1000 * 3600) + (minutes * 1000 * 60);

		if (totalTime > 2419200000) return interaction.send('You cannot create a reminder for longer than 28 days/a month');

		const reminderHandler = new Reminder({ userID: user.id, reminder: reminder, remind: Date.now() + totalTime });
		await reminderHandler.save();

		let embed = new MessageEmbed()
			.setTitle("Reminder")
			.setColor(randomColor)
			.setThumbnail(user.displayAvatarURL())
			.setDescription(`I'll remind you in ${msToTime(totalTime)} for your reminder \n **Reminder**: ${reminder}`)
			.setFooter(`Command called by ${user.tag}`, user.displayAvatarURL());
		return interaction.send(embed);
    }
}