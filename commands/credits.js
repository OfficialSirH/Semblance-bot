const { MessageEmbed } = require('discord.js'), {randomColor} = require('../constants');

module.exports = {
	description: "Lists everyone that has helped with the project of Semblance, including myself(SirH).",
	category: 'semblance',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let embed = new MessageEmbed()
		.setTitle("Credits")
		.setColor(randomColor)
		.setDescription("Special Thanks to Aditya for motivating me from the very beginning to work on this bot. " +
			"If it weren't for him, my bot wouldn't even be at this point right now; running on an actual server, " +
			"built with a better Discord module than previously, and have this many features. He even convinced Hype " +
			"to add my bot to Cell to Singularity, which I can't thank him enough for, cause I was too shy to ask Hype. " +
			"Thanks again, Aditya, you've helped me a lot. :D")
		.addFields(
			{ name: "Developer", value: "SirH" },
			{ name: "Special Thanks and Organizer", value: "Aditya" },
			{ name: "Artist", value: "**Semblance Artist:** cabiie\n**Semblance Beta Artist:** Lemon ([Lemon's Instagram page](https://www.instagram.com/creations_without_limtation/))" },
			{ name: "Silly dude who makes up funny ideas", value: "NerdGamer2848" },
			{ name: "Early Testers", value: "Aditya, Parrot, Diza, 0NrD, and Aure" },
		);
	message.channel.send(embed);
}
