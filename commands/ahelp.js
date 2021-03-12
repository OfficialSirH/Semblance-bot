const { MessageEmbed } = require('discord.js'), {randomColor} = require('../constants'), { currentLogo, prefix } = require('../config.js');

module.exports = {
	description: "Gives a list of all available admin commands.",
	category: 'help',
	usage: {
		"": ""
	},
	permissionRequired: 1,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	const adminCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'admin').map(key => `**\`${prefix}${key}\`**`)
	let embed = new MessageEmbed()
		.setColor(randomColor)
		.setTitle("**-> Admin Commands**")
		.setThumbnail(client.user.displayAvatarURL())
		.setDescription(adminCommands.join(', '));
	message.channel.send(embed);
}