const { MessageEmbed } = require('discord.js'), {randomColor} = require("../constants");

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
	let link = args[0];
	if (link == 'support' || identifier == 'support') return user.send("https://discord.gg/XFMaTn6taf");
	if (link) return message.reply("Your input is either invalid or has a typo").then(msg => setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000));
	let embed = new MessageEmbed()
		.setTitle("Bot Invite")
		.setColor(randomColor)
		.setThumbnail(client.user.displayAvatarURL())
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setDescription(`Invite me to your server be clicking [here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot+applications.commands).`)
		.setFooter(`Spread the word about Semblance!`);
	message.author.send(embed);
	message.reply("Check your DMs :D");
}