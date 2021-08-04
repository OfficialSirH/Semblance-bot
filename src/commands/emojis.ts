import { GuildEmoji, Message, MessageEmbed } from "discord.js";
import { Semblance } from "../structures";
import { promises as fs } from 'fs';
import { randomColor, addableEmojis } from "../constants";
import config from '@semblance/config';
const { prefix } = config;

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
	if (args.length == 0 || args[0] != 'add') return message.reply({ embeds: [new MessageEmbed()
	.setAuthor(message.author.tag, message.author.displayAvatarURL())
	.setColor(randomColor)
	.setDescription(`type \`${prefix}emojis add\` to add these emojis:\n${addableEmojis.join(' ')}`)] });
	try {
		const files = await fs.readdir('./src/images/emojis');
			let fileNames = [], addedEmojis: GuildEmoji[] = [];
			for (let file of files) fileNames.push(file.replace('.png', '').toLowerCase());
			for (let fileName of fileNames) if (!message.guild.emojis.cache.map(e => e.name).includes(fileName)) {
				addedEmojis.push(await message.guild.emojis.create(`./src/images/emojis/${files[fileNames.indexOf(fileName)]}`, fileName));
			}

		let embed = new MessageEmbed()
			.setTitle('New Emojis Added!')
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setColor(randomColor)
			.setDescription(addedEmojis.map(e=>e.toString()).join(' '));
		message.channel.send({ embeds: [embed] });
	} catch(err) {
		message.reply(`hmmmm, something didn't work properly during the process. If this occurs again, please report this issue in the support server(\`${prefix}support\`)`);
	}
}