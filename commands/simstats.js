const { MessageEmbed } = require('discord.js'),
	{randomColor} = require('../constants'),
	{ currentLogo, simStatsLocation } = require('../config').default;

module.exports = {
    description: "",
	category: 'game',
	subcategory: 'main',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let embed = new MessageEmbed()
		.setTitle("Simulation Statistics")
		.attachFiles([currentLogo, simStatsLocation])
		.setThumbnail(currentLogo.name)
		.setColor(randomColor)
		.setImage(simStatsLocation.name)
		.setDescription(`Clicking your currency(Image 1) will open the Semblance/Reality Engine, which looking towards the left side of the engine will have a sliding button(Image 2) that will show your game stats.`);
	message.channel.send(embed);
}
