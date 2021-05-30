import { Message, MessageEmbed } from "discord.js";
import { Semblance } from "../structures";
import * as fs from 'fs';
import { randomColor } from "../constants";

module.exports = {
	description: "Setup Semblance's emojis with this.",
	category: 'admin',
	usage: {
		"": ""
	},
	permissionRequired: 6,
	checkArgs: (args: string[]) => args.length >= 0,
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	fs.readdir('./images/emojis/', async (err, files) => {
		let fileNames = [];
		for (let file of files) fileNames.push(file.replace('.png', '').toLowerCase());
		for (let fileName of fileNames) if (!message.guild.emojis.cache.array().includes(fileName)) {
			await message.guild.emojis.create(`./images/emojis/${files[fileNames.indexOf(fileName)]}`, fileName);
		}

	});
	let embed = new MessageEmbed()
		.setTitle('New Emojis Added!')
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setColor(randomColor)
		.setDescription(message.guild.emojis.cache.map(e => `<:${e.name}:${e.id}>`).join(' '));
	message.channel.send(embed);
}