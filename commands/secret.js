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
	if (args[0] == 'fun') return fun(message);
	let embed = new MessageEmbed()
		.setTitle("Secret Achievements")
		.setDescription(["1. Make an ape dab by tapping on it numerous times.",
			"2. Make an archosaur, named Archie, dance by tapping the archosaur with a tuxedo/suit.",
			"3. Unlock all sharks, *check `s!sharks`*.",
			"**Secrets in the land garden:**",
			"4. Click the paradise bird, an all brown bird with a blue face.",
			"5. While your game camera is still focused on the paradise bird, wait till the bird flies near a small island with the darwin bust statue and click the island.",
			"6. In the savannah section of the land garden, activate camera mode and point the camera to top down so then you can see the top of the mountain ledges, near the lions and elephants you'll find... *sniff*... Archie's bones :(",
			"7. Between the savannah and the jungle section where the river splits them apart, you'll find the Amazonian Dolphin."].join("\n"));
	message.author.send(embed);
}

async function fun(message) {
	let embed = new MessageEmbed()
		.setTitle("Secret")
		.setURL("https://rb.gy/enaq3a");
	message.author.send(embed);
}
