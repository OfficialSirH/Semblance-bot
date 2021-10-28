import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import config from '#config';
import { Information } from '#models/Information';
import type { Command } from '#lib/interfaces/Semblance';
const { roadMap, currentLogo, earlyBeyondTesters, prefix } = config;

export default {
  description: 'Provides info on The Beyond.',
  category: 'game',
  subcategory: 'other',
  aliases: ['roadmap'],
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message, args) => run(message, args),
} as Command<'game'>;

const run = async (message: Message, args: string[]) => {
  if (args[0] == 'clips' || args.join(' ') == 'sneak peeks' || args[0] == 'sneakpeeks') return clips(message);
  if (args[0] == 'count' || args[0] == 'counter') return beyondCounter(message);
  if (args[0] == 'testers') return testerCredits(message);
  const embed = new MessageEmbed()
    .setTitle('Beyond/Road Map')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setImage(roadMap.name)
    .setDescription(
      'Summer 2021. Anyone who wants to give any complaints about the length of the release date can email their complaint to ImAWhinyKaren@gmail.com' +
        `\n\n\`${prefix}beyond sneak peeks\` for sneak peeks\n\n\`${prefix}beyond count\` to see the amount of times that The Beyond has been mentioned by the community of C2S.`,
    );
  message.channel.send({ embeds: [embed], files: [currentLogo, roadMap] });
};

async function clips(message) {
  const embed = new MessageEmbed()
    .setTitle('Beyond Clips')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor)
    .setDescription(
      [
        '[Clip One](https://clips.twitch.tv/CharmingVibrantWatermelonPeoplesChamp)',
        '[Clip Two](https://clips.twitch.tv/GracefulSmellyYakDoggo)',
        '[Clip Three](https://clips.twitch.tv/BillowingCovertFishFeelsBadMan)',
        '[Clip Four](https://clips.twitch.tv/NurturingMushyClintmullinsDuDudu)',
        '[Clip Five](https://clips.twitch.tv/MistyAgileWrenLitFam)',
        '[Clip Six](https://clips.twitch.tv/AffluentDoubtfulPeachDendiFace)',
        '[Clip Seven](https://clips.twitch.tv/CarefulUnusualDootResidentSleeper)',
        '[Clip Eight](https://clips.twitch.tv/AbstemiousCreativeChoughJKanStyle)',
        '[Clip Nine](https://clips.twitch.tv/WrongGiftedBeefThisIsSparta-wCREhZ-Q_OnJIs24)',
        '[Clip Ten](https://clips.twitch.tv/JoyousCarefulCheesePMSTwin-QbCPmpwO_taQfUTe)',
        '[Clip Eleven](https://clips.twitch.tv/ConfidentTallAniseSpicyBoy-zSeEcUibWET5R4pc)',
      ].join('\n'),
    )
    .setFooter('Patience for The Beyond is key');
  message.channel.send({ embeds: [embed] });
}

async function beyondCounter(message) {
  const beyondCount = await Information.findOne({ infoType: 'beyondcount' });
  const embed = new MessageEmbed()
    .setTitle('Beyond Counter')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor)
    .setDescription(`The Beyond has been mentioned ${beyondCount.count} time(s) since ${new Date(1611959542848)}`)
    .setFooter('Since')
    .setTimestamp(1611959542848);
  message.channel.send({ embeds: [embed] });
}

function testerCredits(message) {
  const embed = new MessageEmbed()
    .setTitle('Credits to our Early Private Beta Testers!')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor)
    .setDescription(earlyBeyondTesters.join('\n'))
    .setFooter('Thank you Early Private Beta Testers for helping the ComputerLunch team with testing The Beyond! :D');
  message.channel.send({ embeds: [embed] });
}
