const { MessageEmbed } = require('discord.js'), {randomColor} = require('../constants'),
	{ roadMap, currentLogo } = require('../config.js').default, 
	Information = require('./edit').Information;

module.exports = {
	description: "Provides info on The Beyond.",
	category: 'game',
	subcategory: 'other',
	usage: {
		"": ""
	},
	aliases: ["roadmap"],
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	if (args[0] == 'clips' || args.join(" ") == 'sneak peeks' || args[0] == 'sneakpeeks') return clips(message);
	if (args[0] == 'count' || args[0] == 'counter') return beyondCounter(message);
	let embed = new MessageEmbed()
		.setTitle("Beyond/Road Map")
		.setColor(randomColor)
		.attachFiles([currentLogo, roadMap])
		.setThumbnail(currentLogo.name)
		.setImage(roadMap.name)
		.setDescription("Summer 2021. Anyone who wants to give any complaints about the length of the release date can email their complaint to ImAWhinyKaren@gmail.com"+
						"\n\n`s!beyond sneak peeks` for sneak peeks\n\n`s!beyond count` to see the amount of times that The Beyond has been mentioned by the community of C2S.");
	message.channel.send(embed);
}

async function clips(message) {
	let embed = new MessageEmbed()
		.setTitle("Beyond Clips")
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setColor(randomColor)
		.setDescription([`[Clip One](https://clips.twitch.tv/CharmingVibrantWatermelonPeoplesChamp)`,
			`[Clip Two](https://clips.twitch.tv/GracefulSmellyYakDoggo)`,
			`[Clip Three](https://clips.twitch.tv/BillowingCovertFishFeelsBadMan)`,
			`[Clip Four](https://clips.twitch.tv/NurturingMushyClintmullinsDuDudu)`,
			`[Clip Five](https://clips.twitch.tv/MistyAgileWrenLitFam)`,
			`[Clip Six](https://clips.twitch.tv/AffluentDoubtfulPeachDendiFace)`,
			`[Clip Seven](https://clips.twitch.tv/CarefulUnusualDootResidentSleeper)`,
			`[Clip Eight](https://clips.twitch.tv/AbstemiousCreativeChoughJKanStyle)`,
			`[Clip Nine](https://clips.twitch.tv/WrongGiftedBeefThisIsSparta-wCREhZ-Q_OnJIs24)`,
			`[Clip Ten](https://clips.twitch.tv/JoyousCarefulCheesePMSTwin-QbCPmpwO_taQfUTe)`,
			`[Clip Eleven](https://clips.twitch.tv/ConfidentTallAniseSpicyBoy-zSeEcUibWET5R4pc)`].join("\n"))
		.setFooter("Patience for The Beyond is key");
	message.channel.send(embed);
}

async function beyondCounter(message) {
	const beyondCount = await Information.findOne({ infoType: 'beyondcount' });
	let embed = new MessageEmbed()
		.setTitle("Beyond Counter")
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setColor(randomColor)
		.setDescription(`The Beyond has been mentioned ${beyondCount.count} time(s) since ${new Date(1611959542848)}`)
		.setFooter("Since")
		.setTimestamp(1611959542848);
	message.channel.send(embed);
}