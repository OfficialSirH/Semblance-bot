const { MessageEmbed } = require('discord.js'),
    {randomColor} = require('../constants'),
    { currentLogo, trexBadge } = require('../config.js');

module.exports = {
    description: "",
    category: 'game',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let embed = new MessageEmbed()
		.setTitle(`${trexBadge}Tyrannosaurus Rex`)
		.setColor(randomColor)
		.attachFiles(currentLogo)
		.setThumbnail(currentLogo.name)
		.setDescription('The T-Rex, the rightful king of the Mesozoic Valley, can be unlocked at Rank 26 in the Mesozoic Valley, which will also earn you an achievement called, "Birth of a Tyrant".');
	message.channel.send(embed);
}