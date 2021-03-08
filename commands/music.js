const { MessageEmbed } = require('discord.js'),
	{randomColor} = require('../constants'),
	{ currentLogo } = require('../config.js');

module.exports = {
	description: "Provides the links to the ingame music on the Fandom wiki and on Spotify.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let embed = new MessageEmbed()
		.setTitle("Music")
		.setColor(randomColor)
		.attachFiles(currentLogo)
		.setThumbnail(currentLogo.name)
		.setDescription([`Here's a link to the music, ${message.author.tag}`,
			"[Fandom Wiki](https://cell-to-singularity-evolution.fandom.com/wiki/music)",
			"[Spotify Link](https://open.spotify.com/playlist/6XcJkgtRFpKwoxKleKIOOp?si=uR4gzciYQtKiXGPwY47v6w)"].join('\n'));
	message.channel.send(embed);	
}