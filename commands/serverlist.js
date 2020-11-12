const { MessageEmbed, MessageAttachment } = require('discord.js');
const randomColor = require('../constants/colorRandomizer.js');

module.exports = {
	description: "Lists all servers that Semblance is in.",
	usage: {
		"": ""
	},
	permissionRequired: 7,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let serverList = [];
	let serverCount = 0;
	let semblanceAvatar = client.user.avatarURL();
	client.guilds.cache.forEach( guild => {
		serverCount++;
		try {
			serverList.push(`${guild.name}(${guild.owner.user.tag})`);
		} catch(err) {
			serverList.push(`${guild.name}(*unable to get owner's name*)`);
		}
	});
	let embed = new MessageEmbed()
	.setTitle(`Server List [${serverCount}]`)
	.setColor(randomColor())
	.setThumbnail(semblanceAvatar)
	.setDescription(serverList)
	.setFooter("Server owners' names are inbetween ()");
	message.channel.send(embed);
}