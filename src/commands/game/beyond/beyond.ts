import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, prefix, randomColor, Subcategories } from '#constants/index';
import { roadMap, currentLogo, earlyBeyondTesters } from '#config';
import { Args, Command } from '@sapphire/framework';
import type { SapphireClient } from '@sapphire/framework';

export default class Beyond extends Command {
  public override name = 'beyond';
  public override description = 'Provides info on The Beyond.';
  public override fullCategory = [Categories.game, Subcategories.beyond];

  public override async messageRun(message: Message, args: Args) {
    if (args[0] == 'clips' || args.join(' ') == 'sneak peeks' || args[0] == 'sneakpeeks') return clips(message);
    if (args[0] == 'count' || args[0] == 'counter') return beyondCounter(message);
    if (args[0] == 'testers') return testerCredits(message);
    const embed = new Embed()
      .setTitle('Beyond/Road Map')
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setImage(roadMap.name)
      .setDescription(
        'Summer 2021. Anyone who wants to give any complaints about the length of the release date can email their complaint to ImAWhinyKaren@gmail.com' +
          `\n\n\`$${prefix}beyond sneak peeks\` for sneak peeks\n\n\`$${prefix}beyond count\` to see the amount of times that The Beyond has been mentioned by the community of C2S.`,
      );
    message.channel.send({ embeds: [embed], files: [currentLogo, roadMap] });
  }
}

export default {
  description: 'Provides info on The Beyond.',
  category: 'game',
  subcategory: 'other',
  aliases: ['roadmap'],
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message, args) => run(client, message, args),
} as Command<'game'>;

const run = async (client: SapphireClient, message: Message, args: string[]) => {
  if (args[0] == 'clips' || args.join(' ') == 'sneak peeks' || args[0] == 'sneakpeeks') return clips(message);
  if (args[0] == 'count' || args[0] == 'counter') return beyondCounter(message);
  if (args[0] == 'testers') return testerCredits(message);
  const embed = new Embed()
    .setTitle('Beyond/Road Map')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setImage(roadMap.name);
  message.channel.send({ embeds: [embed], files: [currentLogo, roadMap] });
};

async function clips(message: Message) {
  const embed = new Embed()
    .setTitle('Beyond Clips')
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
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
    .setFooter({ text: 'Patience for The Beyond is key' });
  message.channel.send({ embeds: [embed] });
}

async function beyondCounter(message: Message) {
  const embed = new Embed()
    .setTitle('Beyond Counter')
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(
      `The Beyond has been mentioned 5203 times since ${new Date(1611959542848)} all the way till ${new Date(
        1635971517445,
      )}`,
    )
    .setFooter({ text: 'Since' })
    .setTimestamp(1611959542848);
  message.channel.send({ embeds: [embed] });
}

function testerCredits(message: Message) {
  const embed = new Embed()
    .setTitle('Credits to our Early Private Beta Testers!')
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(earlyBeyondTesters.join('\n'))
    .setFooter({
      text: 'Thank you Early Private Beta Testers for helping the ComputerLunch team with testing The Beyond! :D',
    });
  message.channel.send({ embeds: [embed] });
}
