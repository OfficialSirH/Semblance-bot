import { MessageEmbed, CommandInteraction } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Afk } from '@semblance/models';
import { Semblance } from '../structures';

module.exports = {
    permissionRequired: 0
}

module.exports.run = async (client: Semblance, interaction: CommandInteraction) => {
	let reason = interaction.options.has('reason') ? interaction.options.get('reason').value as string : "Just because";
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