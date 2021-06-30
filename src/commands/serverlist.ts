import { Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { randomColor, guildBookPage } from '@semblance/constants';
import { Semblance } from '../structures';
import { serversPerPage } from '../constants/commands';

module.exports = {
	description: "Lists all servers that Semblance is in.",
	category: 'developer',
	usage: {
		"": ""
	},
	permissionRequired: 7,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	const { chosenPage, pageDetails } = guildBookPage(client, args[0]),
	numOfPages = Math.ceil(client.guilds.cache.size / serversPerPage);

	const components = [new MessageActionRow()
	.addComponents([new MessageButton()
		.setLabel('First Page')
		.setStyle('SECONDARY')
		.setDisabled(chosenPage === 1)
		.setCustomID(JSON.stringify({
			command: 'serverlist',
			action: 'first',
			id: message.author.id,
			page: chosenPage
		})),
		new MessageButton()
		.setLabel('Left')
		.setStyle('SECONDARY')
		.setEmoji('⬅')
		.setDisabled(chosenPage === 1)
		.setCustomID(JSON.stringify({
			command: 'serverlist',
			action: 'left',
			id: message.author.id,
			page: chosenPage
		})),
		new MessageButton()
		.setLabel('Right')
		.setStyle('SECONDARY')
		.setEmoji('➡')
		.setDisabled(chosenPage === numOfPages)
		.setCustomID(JSON.stringify({
			command: 'serverlist',
			action: 'right',
			id: message.author.id,
			page: chosenPage
		})),
		new MessageButton()
		.setLabel('Last Page')
		.setStyle('SECONDARY')
		.setDisabled(chosenPage === numOfPages)
		.setCustomID(JSON.stringify({
			command: 'serverlist',
			action: 'last',
			id: message.author.id,
			page: chosenPage
		}))
	])
	],
	embed = new MessageEmbed()
		.setTitle(`Server List [${client.guilds.cache.size}] - Page ${chosenPage}`)
		.setColor(randomColor)
		.setThumbnail(client.user.displayAvatarURL())
		.setDescription(pageDetails)
		.setFooter(`Page ${chosenPage} out of ${numOfPages}`);
	message.channel.send({ embeds: [embed], components });
}