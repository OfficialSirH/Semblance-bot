import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config'; 
import type { Semblance } from '../structures';
import type { Command } from '@semblance/lib/interfaces/Semblance';
const { prefix } = config;

export default {
	description: "List all miscelaneous commands",
	category: 'help',
	permissionRequired: 0,
	checkArgs: () => true,
	run: (client, message) => run(client, message)
} as Command<'help'>;

const run = async (client: Semblance, message: Message) => {
	const serverCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'server').map(key => `**\`${prefix}${key}\`**`),
		funCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'fun').map(key => `**\`${prefix}${key}\`**`),
		utilityCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'utility').map(key => `**\`${prefix}${key}\`**`),
		semblanceCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'semblance').map(key => `**\`${prefix}${key}\`**`);
	let embed = new MessageEmbed()
		.setTitle("Miscellaneous Commands")
		.setThumbnail(client.user.displayAvatarURL())
		.setColor(randomColor)
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.addFields(
			{
				name: '**-> Server Commands**',
				value: serverCommands.join(', '),
				inline: true
			},
			{
				name: '**-> Fun Commands**',
				value: funCommands.join(', '),
				inline: true
			},
			{ 
				name: '**-> Utility Commands**',
				value: utilityCommands.join(', '),
				inline: true
			},
			{
				name: '**=> Semblance-related Commands**',
				value: semblanceCommands.join(', '),
				inline: true
			}
		);
	message.channel.send({ embeds: [embed] });
}
