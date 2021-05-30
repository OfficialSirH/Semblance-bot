import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance } from '../structures';

module.exports = {
	description: "Lists all servers that Semblance is in.",
	category: 'developer',
	usage: {
		"": ""
	},
	permissionRequired: 7,
	checkArgs: (args: string[]) => args.length >= 0
}

// TODO: Add button support for going through each server page

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let guildBook = {},
		numOfPages = client.guilds.cache.size / 50,
		chosenPage = Number.parseInt(args[0]);

	if (!chosenPage || chosenPage < 1) chosenPage = 1;
	else if (chosenPage > Math.ceil(numOfPages)) chosenPage = Math.ceil(numOfPages);
	else chosenPage = chosenPage == NaN ? 1 : chosenPage;

	for (let i = 0; i < Math.ceil(numOfPages); i++) {
        guildBook[`page_${i + 1}`] = {};
        let loopCount = client.guilds.cache.size < 49 + (i * 50) ? client.guilds.cache.size - 1 : 49 + (i * 50);
        for (let j = 50 * i; j < loopCount; j++) guildBook[`page_${i + 1}`][`${client.guilds.cache.array()[j].name}`] = `${client.guilds.cache.array()[j].id}`;
    }

	let pageDetails = "";
	for (const [key, value] of Object.entries(guildBook[`page_${chosenPage}`])) {
		pageDetails += `${key} : ${value}\n`;
	}

	let embed = new MessageEmbed()
		.setTitle(`Server List [${client.guilds.cache.size}] - Page ${chosenPage}`)
		.setColor(randomColor)
		.setThumbnail(client.user.displayAvatarURL())
		.setDescription(pageDetails)
		.setFooter(`Page ${chosenPage} out of ${Math.ceil(numOfPages)}`);
	message.channel.send(embed);
}