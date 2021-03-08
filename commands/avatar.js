const { MessageEmbed } = require('discord.js'), {randomColor} = require('../constants');

module.exports = {
	description: "See a user's avatar.",
	usage: {
		"<userID/mention>": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let user;
	if (!args || args.length == 0) user = message.author;
	else {
		user = args[0].match(/\d{17,20}/).join();
		if (!!!user) return message.reply("The provided input is invalid");
		user = await client.users.fetch(user);
		if (!user) return message.reply('I couldn\'t find that user');
	}
	let image = `${user.displayAvatarURL({ dynamic: true })}?size=1024`;
	let embed = new MessageEmbed()
		.setTitle("Avatar")
		.setAuthor(user.tag, user.displayAvatarURL())
		.setColor(randomColor)
		.setImage(image)
	message.channel.send(embed);
}