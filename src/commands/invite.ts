import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance } from '../structures';

module.exports = {
	description: "get invite for bot, SirH server, or C2S server",
	category: 'semblance',
	usage: {
		"<support>": "support will retrieve the server link to SirH Stuff."
	},
	aliases: ['support'],
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = (client: Semblance, message: Message, args: string[], identifier: string) => {
	let link = args[0];
	if (link == 'support' || identifier == 'support') return message.author.send("https://discord.gg/XFMaTn6taf");
	if (link) return message.reply("Your input is either invalid or has a typo").then(msg => setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000));
	let embed = new MessageEmbed()
		.setTitle("Bot Invite")
		.setColor(randomColor)
		.setThumbnail(client.user.displayAvatarURL())
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setDescription(`Invite me to your server be clicking [here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot+applications.commands).`)
		.setFooter(`Spread the word about Semblance!`);
	message.author.send({ embeds:[embed] });
	message.reply("Check your DMs :D");
}