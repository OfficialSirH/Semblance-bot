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
		user = message.author;
	} else {
		try {
			var user = args[0].replace(/<@!/, "").replace(/<@/, "").replace(/>/, "");
			user = await client.users.fetch(user);
			if (!user) return message.reply('I couldn\'t find that user');
		} catch (error) {
			console.log(error);
			message.reply("Something didn't work right, oops.");
			return;
		}
	}
	var image = user.displayAvatarURL({ dynamic: true});
	image = `${image}?size=1024`;
	var embed = new MessageEmbed()
	.setTitle("Avatar")
	.setAuthor(user.tag, user.displayAvatarURL())
	.setColor(randomColor())
	.setImage(image)
	message.channel.send(embed);
}