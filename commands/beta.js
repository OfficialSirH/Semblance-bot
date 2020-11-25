const { MessageEmbed } = require('discord.js'), { currentLogo } = require('../config.js'), randomColor = require('../constants/colorRandomizer.js');

module.exports = {
	description: "Get info on the latest beta.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let embed = new MessageEmbed()
		.setTitle("Beta")
		.setColor(randomColor())
		.attachFiles(currentLogo)
		.setThumbnail("attachment://Current_Logo.png")
		.setDescription(["**Both Steam(7.19) & Android(7.17)**",
			"-Fixed bug showing 6 available items in the life notification tab.",
					"- Fixed Issue Tree line connections were not displaying after buying a item.",
					"- Added 2 NEW reality engine speed simulation upgrades and reduce cost on overdrive boost upgrades.",
					"- Kangaroo and Koala texture updated.",
					"- Added Beaver animation",
					"- Adjusted land masses in the land garden.",
					"- Reduced over all memory allocation.This should help prevent the game from crashing on old mobile devices.",
					"- Added button to Skip Open Geode After the first dino prestige.",
					"- Get ready for the photo contest.The Camera mode allow for more angle rotation to get the perfect shot.This feature does clip though the world, but we want to give photographs more control of their shooting.",
					"- Reboot button popup, now displays the amount of speed simulation increase you will get after rebooting."].join('\n'))
		.addFields(
			{
				name: "Steam(7.19)",
				value: [
				"- New Reality Engine upgrades",
				"--- Thermal Equalizer 6.67E+10 Simulation Speed 200 % more efficient",
				"--- Void Accelerator 2.51E+12 Simulation Speed 250 % more efficient"].join('\n'), inline: true
			})
		.setFooter("Beta is epicc");
	message.channel.send(embed);
}
