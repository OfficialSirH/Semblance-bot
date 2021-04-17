const { MessageEmbed } = require('discord.js'),
	{randomColor} = require("../constants"),
	{ prefix } = require('../config').default;

module.exports = {
	description: "List all miscelaneous commands",
	category: 'help',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
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
	message.channel.send(embed);
}
