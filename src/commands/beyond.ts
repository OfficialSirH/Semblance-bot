import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Information } from '../models';
import { Semblance } from '../structures';
const { roadMap, currentLogo, earlyBeyondTesters, prefix } = config;

module.exports = {
	description: "Provides info on The Beyond.",
	category: 'game',
	subcategory: 'other',
	usage: {
		"": ""
	},
	aliases: ["roadmap"],
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	if (args[0] == 'clips' || args.join(" ") == 'sneak peeks' || args[0] == 'sneakpeeks') return clips(message);
	if (args[0] == 'count' || args[0] == 'counter') return beyondCounter(message);
	if (args[0] == 'testers') return testerCredits(message);
	let embed = new MessageEmbed()
		.setTitle("Beyond/Road Map")
		.setColor(randomColor)
		.setThumbnail(currentLogo.name)
		.setImage(roadMap.name)
		.setDescription("Summer 2021. Anyone who wants to give any complaints about the length of the release date can email their complaint to ImAWhinyKaren@gmail.com"+
						`\n\n\`${prefix}beyond sneak peeks\` for sneak peeks\n\n\`${prefix}beyond count\` to see the amount of times that The Beyond has been mentioned by the community of C2S.`);
	message.channel.send({ embeds: [embed], files: [currentLogo, roadMap] });
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
	message.channel.send({ embeds: [embed] });
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
	message.channel.send({ embeds: [embed] });
}

function testerCredits(message) {
	let embed = new MessageEmbed()
		.setTitle("Credits to our Early Private Beta Testers!")
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setColor(randomColor)
		.setDescription(earlyBeyondTesters.join('\n'))
		.setFooter(`Thank you Early Private Beta Testers for helping the ComputerLunch team with testing The Beyond! :D`);
	message.channel.send({ embeds: [embed] });
}