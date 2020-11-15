const { MessageEmbed } = require('discord.js');
const randomColor = require('../constants/colorRandomizer.js');

module.exports = {
	description: "See a user's avatar.",
	usage: {
		"<userID/mention>": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	if (args.length == 0) {
		var user = message.author;
	} else {
		var user = args[0].match(/\d/g).join('');
		user = await client.users.fetch(user);
		if (!user) return message.reply('I couldn\'t find that user');
	}
	let image = user.displayAvatarURL({ dynamic: true });
	image = `${image}?size=1024`;
	let embed = new MessageEmbed()
		.setTitle("Avatar")
		.setAuthor(user.tag, user.displayAvatarURL())
		.setColor(randomColor())
		.setImage(image)
	message.channel.send(embed);
}