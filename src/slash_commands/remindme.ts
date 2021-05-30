import { MessageEmbed } from 'discord.js';
import { Reminder } from '@semblance/models';
import { randomColor, msToTime } from '@semblance/constants';
import { Semblance, Interaction } from '@semblance/structures';

module.exports = {
    permissionRequired: 0,
    run: async (client: Semblance, interaction: Interaction) => {
		let timeAmount = /(?:(?<days>\d{1,2})d)?(?:(?<hours>\d{1,2})h)?(?:(?<minutes>\d{1,2})m)?/i.exec(interaction.data.options[0].value as string),
            reminder = interaction.data.options[1].value,
            user = interaction.member.user;

		if (timeAmount == null) return interaction.send('Your input for time is invalid, please try again.');
		const { groups: { days = 0, hours = 0, minutes = 0 }} = timeAmount as unknown as TimeLengths;
		if ([days, hours, minutes].every(time => !time)) return interaction.send('Your input for time was invalid, please try again.');
    
		let totalTime = (days * 1000 * 3600 * 24) + (hours * 1000 * 3600) + (minutes * 1000 * 60);

		if (totalTime > 2419200000) return interaction.send('You cannot create a reminder for longer than 28 days/a month');

		await (new Reminder({ userID: user.id, reminder: reminder, remind: Date.now() + totalTime })).save();

		let embed = new MessageEmbed()
			.setTitle("Reminder")
			.setColor(randomColor)
			.setThumbnail(user.displayAvatarURL())
			.setDescription(`I'll remind you in ${msToTime(totalTime)} for your reminder \n **Reminder**: ${reminder}`)
			.setFooter(`Command called by ${user.tag}`, user.displayAvatarURL());
		interaction.send(embed);
    }
}

interface TimeLengths {
	groups: {
		days: number;
		hours: number;
		minutes: number;
	}
}