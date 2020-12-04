const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js'),
	{ roadMap, currentLogo } = require('../config.js');

module.exports = {
	description: "Provides info on The Beyond.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	if (args[0] == 'clips' || args.join(" ") == 'sneak peaks' || args[0] == 'sneakpeaks') return clips(message);
	let embed = new MessageEmbed()
		.setTitle("Beyond")
		.setColor(randomColor())
		.attachFiles([currentLogo, roadMap])
		.setThumbnail("attachment://Current_Logo.png")
		.setImage("attachment://roadMap.png")
		.setDescription("The Beyond hasn't been released yet, but I know when it will be released, which will be- ***ERROR... data corruption, can't compile***");
	message.channel.send(embed);
}

async function clips(message) {
	let embed = new MessageEmbed()
		.setTitle("Beyond Clips")
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setColor(randomColor())
		.setDescription([`[Clip One](https://clips.twitch.tv/CharmingVibrantWatermelonPeoplesChamp)`,
			`[Clip Two](https://clips.twitch.tv/GracefulSmellyYakDoggo)`,
			`[Clip Three](https://clips.twitch.tv/BillowingCovertFishFeelsBadMan)`,
			`[Clip Four](https://clips.twitch.tv/NurturingMushyClintmullinsDuDudu)`].join("\n"))
		.setFooter("Patience for The Beyond is key");
	message.channel.send(embed);
}