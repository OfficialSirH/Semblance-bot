import type { Message } from 'discord.js';
import type { Semblance } from '../structures';
import type { Command } from '@semblance/lib/interfaces/Semblance';
import { MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Afk } from '@semblance/models';

export default {
	description: "Set yourself afk so users know you're unavailable when they ping you.",
	category: 'utility',
	usage: {
		"<reason>": "Provide your reason why you're afk, or don't and it'll default 'just because'."
	},
	permissionRequired: 0,
	checkArgs: () => true,
	run: (client, message, args) => run(client, message, args)
} as Command<'utility'>;

const run = async (_client: Semblance, message: Message, args: string[]) => {
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
