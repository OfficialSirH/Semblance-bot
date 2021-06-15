import { Message, MessageEmbed, User } from 'discord.js'; 
import { randomColor } from '@semblance/constants'; 
import { Semblance } from '../structures';

module.exports = {
	description: "See a user's avatar.",
	category: 'utility',
	usage: {
		"<userID/mention>": ""
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let user: string | User;
	if (!args || args.length == 0) user = message.author;
	else {
		user = message.mentions.users.first();
		if (!user) user = args[0].match(/\d{17,20}/).join();
		if (!user) return message.reply("The provided input is invalid");
		user = await client.users.fetch((user as User)?.id, { cache: false });
		if (!user) return message.reply('I couldn\'t find that user');
	}
	let image = `${user.displayAvatarURL({ dynamic: true })}?size=4096`;
	let embed = new MessageEmbed()
		.setTitle("Avatar")
		.setAuthor(user.tag, user.displayAvatarURL())
		.setColor(randomColor)
		.setImage(image)
	message.channel.send({ embeds: [embed] });
}