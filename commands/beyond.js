const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js'),
	{ roadMap, currentLogo } = require('../config.js'), 
	Information = require('./edit').Information;

module.exports = {
	description: "Provides info on The Beyond.",
	usage: {
		"": ""
	},
	aliases: ["roadmap"],
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	if (args[0] == 'clips' || args.join(" ") == 'sneak peaks' || args[0] == 'sneakpeaks') return clips(message);
	if (args[0] == 'count' || args[0] == 'counter') return beyondCounter(message);
	let embed = new MessageEmbed()
		.setTitle("Beyond/Road Map")
		.setColor(randomColor())
		.attachFiles([currentLogo, roadMap])
		.setThumbnail("attachment://Current_Logo.png")
		.setImage("attachment://roadMap.png")
		.setDescription("Spring/Q1 2021. Anyone who wants to give any complaints about the length of the release date can email their complaint to ImAWhinyKaren@gmail.com"+
						"\n\n`s!beyond sneak peaks` for sneak peaks\n\n`s!beyond count` to see the amount of times that The Beyond has been mentioned by the community of C2S.");
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

async function beyondCounter(message) {
	const beyondCount = await Information.findOne({ infoType: 'beyondcount' });
	let embed = new MessageEmbed()
		.setTitle("Beyond Counter")
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setColor(randomColor())
		.setDescription(`The Beyond has been mentioned ${beyondCount.count} time(s) since ${new Date(1611959542848)}`)
		.setFooter("Since")
		.setTimestamp(1611959542848);
	message.channel.send(embed);
}