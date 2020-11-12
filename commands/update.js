const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js'), { currentLogo } = require('../config.js');

module.exports = {
	description: "Get info on the latest update of C2S.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let embed = new MessageEmbed()
		.setTitle("Steam and Mobile Updates")
		.setColor(randomColor())
		.attachFiles(currentLogo)
		.setThumbnail("attachment://Current_Logo.png")
		.setDescription(["**Steam(7_00):**",

			"\n**New Traits to Discover!**",
			"- From Ibex to Platypus, we've added a diverse array of mammals to our warm-blooded roster!",
			"- Explore the evolutionary branches of the three mammal clades: Eutherians, Marsupials, and Monotremes!",
			"- Lions, tigers, and bears... oh, my! Encounter different families of Eutherians, including Caniformes, Feliformes, and more.",
			"- The Land Garden has now been divided into 6 biomes: tundra, desert, savannah, rainforest, grasslands, and the outback!",
			"- Treat your eyes to improved textures, restructured terrain, and letied foliage!",

			"\n**Additional Features:**",
			"- Find 6 mysterious glitches in the simulation after you achieve Singularity! It looks like they need MetaBits to grant access to mammal branches on the main tree...",
			"- Collect 30 new achievements to learn more about these fascinating animals!",
			"- We combined the Reality Engine and Terminus Chamber into one space for Semblance! Access your simulation information in one, easy place.",
			"- Earn a new Glass Node in Semblance's Terminus Chamber once you unlock all mammals!",
			"- Listen to new sound effects as you purchase all major Civilization and Mars generators!",
			"- Command your Nanobots! Set them to Buy Mode for an ultra-fast purchasing experience, limited to items on the screen in Camera View.",
			"- Say cheetah! Camera mode now has a lens shift feature, allowing you to improve your photos' compositions.",

			"\n**Fixes And Other Features:**",
			"- Keep track of your earnings and production speed in the updated UI of the Reality Engine!",
			"- The camera has been refactored to prevent scenery clipping in during New Life unlock sequences.",
			"- We reduced the whiplash spin when you exit Camera View on an animal in the Land Garden.",
			"- Camera View back and forward buttons have been tuned.",
			"- Modified game balance to improve pacing.",
			"- Translation improvements.",

			"Stay cellular, and happy discovering!",
			"~Lunch"].join('\n'));
		message.channel.send(embed);
}
