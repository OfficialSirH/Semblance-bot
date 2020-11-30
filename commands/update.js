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
		.setDescription(["**Steam(7_19):**",

			"-Fixed bug showing 6 available items in the life notification tab.",
			"- Fixed Issue Tree line connections were not displaying after buying a item.",
			"- Added 2 NEW reality engine speed simulation upgrades and reduce cost on overdrive boost upgrades.",
			"- Kangaroo and Koala texture updated.",
			"- Added Beaver animation",
			"- Adjusted land masses in the land garden.",
			"- Reduced over all memory allocation.This should help prevent the game from crashing on old mobile devices.",
			"- Added button to Skip Open Geode After the first dino prestige.",
			"- Get ready for the photo contest.The Camera mode allow for more angle rotation to get the perfect shot.This feature does clip though the world, but we want to give photographs more control of their shooting.",
			"- Reboot button popup, now displays the amount of speed simulation increase you will get after rebooting.",
			"- New Reality Engine upgrades",
			"--- Thermal Equalizer 6.67E+10 Simulation Speed 200 % more efficient",
			"--- Void Accelerator 2.51E+12 Simulation Speed 250 % more efficient",

			"Stay cellular, and happy discovering!",
			"~Lunch"].join('\n'))
		.addField("Android(7_19)",
			[`- Kangaroo and Koala have better textures and animations.`,
			`- Added Beaver animation, now they chew on a log.`,
			`- Fixed bug showing 6 available items in the life notification tab.`,
			`- Fixed Issue Tree line connections were not displaying after buying a item.`,
			`- Added button to Skip Open Geode After the first dinosaur prestige.`,
			`- Added 2 NEW reality engine speed simulation upgrades and reduce cost on overdrive boost upgrades.`,
			`--- Thermal Equalizer 6.67E+10 Simulation Speed 200% more efficient`,
			`--- Void Accelerator 2.51E+12 Simulation Speed 250% more efficient`,
			`- Adjusted land masses in the land garden.`,
			`- Reduced over all game memory allocation. This should help crashing on mobile.`,
			`- Next month we will be running a Mammal photo contest. We update the Camera mode to allow for more angle rotation in the Mammal Kingdom allowing you to get that perfect shot. NOTE: This feature does clip though the world, but we want to give photographs more control of their shooting.`,
			`-On the Semblance Interface the red "Reboot" button popup, now displays the amount of speed simulation increase you will get after rebooting.`].join('\n'));
		message.channel.send(embed);
}
