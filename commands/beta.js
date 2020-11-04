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
	var embed = new MessageEmbed()
		.setTitle("March of the Mammals(6_90)")
		.setColor(randomColor())
		.attachFiles(currentLogo)
		.setThumbnail("attachment://Current_Logo.png")
		.setDescription("- Mysterious Glitch nodes populate the tree after your first Singularity reboot. Use Metabits to fix these glitches, which will unlock new branches of evolution on the Main tree.\n"+
			   					  "- 6 Glitch nodes to unlock, which correspond to major branches of Mammal evolution.\n"+
			   					  "- Over 40 new mammal evolutionary trait nodes.\n"+
			   					"- 27 Mammals to unlock in the Main Tree and Land Garden (21 trophy nodes and 6 generators).\n"+
			   					"- 35 Mammal achievements to collect.\n"+
			   					"- Unlock the king of the jungle to complete the next phase of Semblance's experiment within the Terminus Chamber.\n"+
			   					"- Sound effects play for all the major Civilization and Mars generators.\n"+
			   					"- Layout redesign of the Land Garden to accommodate all mammals.\n"+
			   					"- Nanobots Buy Mode is ultra fast. You can use this after a reboot sequence to re-populate your tree.\n"+
			   					"- Nanobots will only buy items that are in Camera View while on the tree.\n"+
			   					"- Camera system refactored to prevent you getting lost when you unlock a new animal in the garden.\n"+
			   					"- Also reduced the whiplash spin when you exit from the Camera zoom-in on an animal.\n"+
			   					"- While zoomed in on Camera mode in the gardens, the back and forward button should take you to the next animal (this is still a bit buggy).")
		.addFields({ name: "Partial Controller Support(Steam Only)", value: "Plug an Xbox or PS4 controller into your computer. "+
			    "Press any button and you should be able to start using the controller to interact with the game." },
			   { name: "Terminus Chamber Glass Nodes", value: "- UI for the Semblance Reality Engine has been updated to incorporate the statistics page and the Terminus Chamber (with experiment progress data)." });
	message.channel.send(embed);
}
