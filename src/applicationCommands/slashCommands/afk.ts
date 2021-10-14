import { MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Afk } from '@semblance/models';
import type { SlashCommand } from '@semblance/lib/interfaces/Semblance';

export default {
    permissionRequired: 0,
	run: async interaction => {
		let reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : "Just because";
		let user = interaction.member.user;
		let afkHandler = await Afk.findOne({ userId: user.id });
		if (!afkHandler) await (new Afk({ userId: user.id, reason })).save();
		else await Afk.findOneAndUpdate({ userId: user.id }, { $set: { reason } });
		
		let embed = new MessageEmbed()
			.setTitle("AFK")
			.setColor(randomColor)
			.setDescription(`You are now afk ${user} \n` +
				`Reason: ${reason}`);
		interaction.reply({ embeds: [embed] });
	}
} as SlashCommand;