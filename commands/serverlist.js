const { MessageEmbed, MessageAttachment } = require('discord.js');
const randomColor = require('../constants/colorRandomizer.js');

module.exports = {
	description: "Lists all servers that Semblance is in.",
	usage: {
		"": ""
	},
	permissionRequired: 7,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let serverCount = client.guilds.cache.reduce((total, cur, ind) => total++, 0);
	let guildBook = {};
	let numOfPages = client.guilds.cache.size / 50;

	if (!args[0]) var chosenPage = 1;
	else if (args[0] < Math.ceil(numOfPages) || args[0] > Math.ceil(numOfPages)) return message.reply(`You chose a non-existent page, please choose between 1 - ${Math.ceil(numOfPages)}`);
	else var chosenPage = args[0];

	for (var i = 0; i < Math.ceil(numOfPages); i++) {
		guildBook[`page_${i + 1}`] = {};
		loopCount = ((client.guilds.cache.size - (50 * i) - 50) >= 0) ? 50 : (client.guilds.cache.size - (50 * i));
		for (var j = 0; j < loopCount; j++) guildBook[`page_${i + 1}`][`${client.guilds.cache.array()[j].name}`] = `${client.guilds.cache.array()[j].id}`;
	}

	let pageDetails = "";
	for (const [key, value] of Object.entries(guildBook[`page_${chosenPage}`])) {
		pageDetails += `${key} : ${value}\n`;
	}

	let embed = new MessageEmbed()
		.setTitle(`Server List [${serverCount}] - Page ${chosenPage}`)
		.setColor(randomColor())
		.setThumbnail(client.user.displayAvatarURL())
		.setDescription(pageDetails)
		.setFooter(`Page ${chosenPage} out of ${Math.ceil(numOfPages)}`);
	message.channel.send(embed);
}