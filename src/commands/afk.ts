import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Afk } from '@semblance/models';
import { Semblance } from '../structures';

module.exports = {
	description: "Set yourself afk so users know you're unavailable when they ping you.",
	category: 'utility',
	usage: {
		"<reason>": "Provide your reason why you're afk, or don't and it'll default 'just because'."
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let reason = (args.length > 0) ? args.join(" ") : "Just because";
	let afkHandler = await Afk.findOne({ userId: message.author.id });
	if (!afkHandler) await (new Afk({ userId: message.author.id, reason: reason })).save();
	else await Afk.findOneAndUpdate({ userId: message.author.id }, { $set: { reason: reason } });
	
	let embed = new MessageEmbed()
		.setTitle("AFK")
		.setColor(randomColor)
		.setDescription(`You are now afk ${message.author} \n` +
			`Reason: ${reason}`);
	message.channel.send({ embeds: [embed] });
}
