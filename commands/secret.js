const { MessageEmbed } = require('discord.js');

module.exports = {
	description: "Secret",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	message.delete();
	if (args[0] == 'achievements') return achievements(message);
	let embed = new MessageEmbed()
		.setTitle("Secret")
		.setURL("https://rb.gy/enaq3a");
	message.author.send(embed);
}

async function achievements(message) {
	let embed = new MessageEmbed()
		.setTitle("Secret Achievements")
		.setDescription("1. Make an ape dab by tapping on it numerous times.\n"+
				"2. Make an archosaur, named Archie, dance by tapping the archosaur with a tuxedo/suit.\n"+
				"3. Unlock all sharks, *check `s!sharks`*.");
	message.author.send(embed);
}
