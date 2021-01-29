const { MessageEmbed } = require('discord.js'), randomColor = require("../constants/colorRandomizer.js");
const { sembID } = require('../config.js');

module.exports = {
	description: "get invite for bot, SirH server, or C2S server",
	usage: {
		"<support>": "support will retrieve the server link to SirH Stuff."
	},
	aliases: ['support'],
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = (client, message, args, identifier) => {
	let user = message.author;
	let link = args[0];
	if (link == 'support' || identifier == 'support') return user.send("https://discord.gg/XFMaTn6taf");
	if (link) return message.reply("You made a typo.").then(msg => msg.delete({ timeout: 5000 }));
	let semblanceAvatar = client.user.avatarURL(),
		userAvatar = message.author.displayAvatarURL();
	let embed = new MessageEmbed()
		.setTitle("Bot Invite")
		.setColor(randomColor())
		.setThumbnail(semblanceAvatar)
		.setAuthor(message.author.tag, userAvatar)
		.setDescription(`Invite me to your server be clicking [here](https://discord.com/oauth2/authorize?client_id=${sembID}&permissions=8&scope=bot+applications.commands).`)
		.setFooter(`Spread the word about Semblance!`);
	user.send(embed);
}