import type { Message, User } from 'discord.js';
import { MessageEmbed } from 'discord.js'; 
import { getAvatar, randomColor } from '@semblance/constants'; 
import type { Semblance } from '../structures';
import type { Command } from '@semblance/lib/interfaces/Semblance';

export default {
	description: "See a user's avatar.",
	category: 'utility',
	usage: {
		"<userId/mention>": ""
	},
	permissionRequired: 0,
	checkArgs: () => true,
	run: (client, message, args) => run(client, message, args)
} as Command<'utility'>;

const run = async (client: Semblance, message: Message, args: string[]) => {
	let user: string | User;
	if (!args || args.length == 0) user = message.author;
	else {
		user = message.mentions.users.first();
		if (!user) user = args[0].match(/\d{17,20}/).join();
		if (!user) return message.reply("The provided input is invalid");
		user = await client.users.fetch((user as User)?.id, { cache: false });
		if (!user) return message.reply('I couldn\'t find that user');
	}
	let embed = new MessageEmbed()
		.setTitle("Avatar")
		.setAuthor(user.tag, user.displayAvatarURL())
		.setColor(randomColor)
		.setImage(getAvatar(user))
	message.channel.send({ embeds: [embed] });
}