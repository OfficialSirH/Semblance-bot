import {
  Client,
  Guild,
  GuildChannel,
  Message,
  MessageEmbed,
  PartialMessage,
  Snowflake,
  TextChannel,
  User,
} from 'discord.js';
import { Game, Reminder, Report } from '#models/index';
import type { Semblance } from '#structures/Semblance';
import { clamp } from '#lib/utils/math';
import type { UserReminder } from '../models/Reminder';
import type { AnimalAPIParams, AnimalAPIResponse } from '#lib/interfaces/catAndDogAPI';
import fetch from 'node-fetch';
import type { GameFormat } from '#models/Game';
import type { DeepLParams, DeepLResponse } from '#lib/interfaces/deepLAPI';
import { messageLinkRegex, attachmentLinkRegex } from '#constants/index';

// gametransfer pages

export const gameTransferPages = [
  'https://i.imgur.com/BsjMAu6.png',
  'https://i.imgur.com/QbDAOkF.png',
  'https://i.imgur.com/w1jEuzh.png',
  'https://i.imgur.com/6qTz2Li.png',
  'https://i.imgur.com/YNBHSw9.png',
];

// reminder functions - checkReminders
export const checkReminders = async (client: Semblance) => {
  const reminderList = await Reminder.find({}),
    now = Date.now();
  if (!reminderList) return;
  const userReminders = {} as Record<Snowflake, UserReminder[]>;

  reminderList
    .filter(user => user.reminders.some(reminder => now > reminder.time))
    .forEach(user => {
      userReminders[user.userId] = user.reminders.filter(reminder => now > reminder.time);
    });

  for (const [key, value] of Object.entries(userReminders) as [Snowflake, UserReminder[]][]) {
    (value as UserReminder[]).forEach(reminder => {
      (client.channels.cache.get(reminder.channelId) as TextChannel).send({
        content: `<@${key}> Reminder: ${reminder.message}`,
        allowedMentions: { users: [key] },
      });
    });
    if (reminderList.find(user => user.userId == key).reminders.length == (value as UserReminder[]).length)
      await Reminder.findOneAndDelete({ userId: key as Snowflake });
    else
      await Reminder.findOneAndUpdate(
        { userId: key as Snowflake },
        {
          $set: {
            reminders: reminderList
              .find(user => user.userId == key)
              .reminders.filter(reminder => now < reminder.time)
              .map((reminder, index) => {
                reminder.reminderId = index + 1;
                return reminder;
              }),
          },
        },
      );
  }
};

// bug functions and constants - correctReportList and CHANNELS

export const correctReportList = async function (
  _client: Semblance,
  message: Message | PartialMessage,
  messageId: Snowflake,
) {
  const deletedReport = await Report.findOneAndDelete({ messageId: messageId });
  if (!deletedReport) return;
  const reportList = await Report.find({});
  const bugIdList = Array.from(reportList.map(r => r.bugId).filter(item => item > deletedReport.bugId));
  bugIdList.forEach(async bugId => {
    const report = await Report.findOneAndUpdate({ bugId: bugId }, { $set: { bugId: bugId - 1 } }, { new: true });
    try {
      (message.guild.channels.cache.get(report.channelId) as TextChannel).messages.fetch(report.messageId).then(msg => {
        const author = msg.embeds[0].author;
        msg.edit({
          embeds: [
            msg.embeds[0]
              .setAuthor(`${author.name.slice(0, author.name.indexOf('\n'))}\nBug Id: #${bugId - 1}`, author.iconURL)
              .setFooter(`#${bugId - 1}`),
          ],
        });
      });
    } catch (e) {
      console.error(e);
      throw new Error('Apparently there was an issue finding that message...');
    }
  });
  console.log(`All ${bugIdList.length} reports have successfully been reorganized!`);
};

export const bugChannels = {
  queue: '798933535255298078' as Snowflake,
  approved: '798933965539901440' as Snowflake,
  imageStorage: '794054989860700179' as Snowflake,
};

// RPS functions and constants

export const countdownGIF = 'https://cdn.discordapp.com/emojis/679872091922759760.gif?v=1';

export function choiceToOutcome(choice: string, opponentChoice: string) {
  if (choice == 'rock') {
    if (opponentChoice == 'paper') return false;
    if (opponentChoice == 'scissors') return true;
    if (opponentChoice == 'lizard') return true;
    if (opponentChoice == 'spock') return false;
    if (opponentChoice == 'rock') return 'tie';
  }
  if (choice == 'paper') {
    if (opponentChoice == 'paper') return 'tie';
    if (opponentChoice == 'scissors') return false;
    if (opponentChoice == 'rock') return true;
    if (opponentChoice == 'lizard') return false;
    if (opponentChoice == 'spock') return true;
  }
  if (choice == 'scissors') {
    if (opponentChoice == 'paper') return true;
    if (opponentChoice == 'scissors') return 'tie';
    if (opponentChoice == 'rock') return false;
    if (opponentChoice == 'lizard') return true;
    if (opponentChoice == 'spock') return false;
  }
  if (choice == 'lizard') {
    if (opponentChoice == 'paper') return true;
    if (opponentChoice == 'scissors') return false;
    if (opponentChoice == 'rock') return false;
    if (opponentChoice == 'lizard') return 'tie';
    if (opponentChoice == 'spock') return true;
  }
  if (choice == 'spock') {
    if (opponentChoice == 'paper') return false;
    if (opponentChoice == 'scissors') return true;
    if (opponentChoice == 'rock') return true;
    if (opponentChoice == 'lizard') return false;
    if (opponentChoice == 'spock') return 'tie';
  }
  return null;
}

export const randomChoice = () => ['rock', 'paper', 'scissors', 'lizard', 'spock'][Math.floor(Math.random() * 5)];

// Serverlist function - Guild Book

export const serversPerPage = 50;

export function guildBookPage(client: Client, chosenPage: string | number) {
  chosenPage = Number.parseInt(chosenPage as string);
  const guildBook = {},
    numOfPages = Math.ceil(client.guilds.cache.size / serversPerPage);

  if (!chosenPage) chosenPage = 1;
  else chosenPage = clamp(chosenPage, 1, numOfPages);

  for (let i = 0; i < numOfPages; i++) {
    guildBook[`page_${i + 1}`] = {};
    const loopCount =
      client.guilds.cache.size < serversPerPage - 1 + i * serversPerPage
        ? client.guilds.cache.size - 1
        : serversPerPage - 1 + i * serversPerPage;
    for (let j = serversPerPage * i; j <= loopCount; j++)
      guildBook[`page_${i + 1}`][`${client.guilds.cache.map(c => c)[j].name}`] = `${
        client.guilds.cache.map(c => c)[j].id
      }`;
  }

  let pageDetails = '';
  for (const [key, value] of Object.entries(guildBook[`page_${chosenPage}`])) {
    pageDetails += `${key} : ${value}\n`;
  }

  return {
    chosenPage,
    pageDetails,
  };
}

// imagegen API fetch
export const fetchCatOrDog = async (query_params: AnimalAPIParams, wantsCat: boolean) => {
  const API_URL = `https://api.the${wantsCat ? 'cat' : 'dog'}api.com/v1/images/search?${new URLSearchParams(
      query_params as Record<string, string>,
    )}`,
    API_KEY = wantsCat ? process.env.CAT_API_KEY : process.env.DOG_API_KEY;

  return (await fetch(API_URL, { headers: { 'X-API-KEY': API_KEY } })).json() as Promise<AnimalAPIResponse>;
};

// deepL API fetch
export const fetchDeepL = async (query_params: DeepLParams) => {
  query_params.target_lang = 'en-US';
  query_params.auth_key = process.env.DEEPL_API_KEY;
  const API_URL = `https://api-free.deepl.com/v2/translate?${new URLSearchParams(
    query_params as Record<string, string>,
  )}`;
  const translateData = (await (await fetch(API_URL)).json()) as DeepLResponse;
  return translateData.translations[0];
};

// game - currentPrice

export async function currentPrice(userData: GameFormat) {
  if (userData.level == userData.checkedLevel) {
    userData = await Game.findOneAndUpdate(
      { player: userData.player },
      {
        $set: {
          checkedLevel: userData.checkedLevel + 1,
          cost: userData.cost + userData.baseCost * Math.pow(userData.percentIncrease, userData.level + 1),
        },
      },
      { new: true },
    );
    return userData.cost;
  }
  return userData.cost == 0 ? userData.baseCost : userData.cost;
}

export const messageLinkJump = async (input: string, user: User, currentGuild: Guild, client: Client) => {
  const messageLink = messageLinkRegex.exec(input);
  if (messageLink == null) return 'No message link found.';
  const {
    groups: { guildId, channelId, messageId },
  } = messageLink;

  const guild = client.guilds.cache.get(guildId);
  const channel = guild.channels.cache.get(channelId) as TextChannel;
  if (channel.nsfw ?? guild.id != currentGuild.id) return 'This channel is not allowed to be jumped to';

  const msg = await channel.messages.fetch(messageId).catch(err => {
    console.log(err);
    return 'No message found.';
  });
  if (typeof msg == 'string') return msg;
  const attachmentLink = attachmentLinkRegex.exec(msg.content);
  if (attachmentLink != null) msg.content = msg.content.replace(attachmentLink[0], '');

  const embed = new MessageEmbed()
    .setAuthor(msg.author.username, msg.author.displayAvatarURL())
    .setThumbnail(user.displayAvatarURL())
    .setDescription(msg.content)
    .addField('Jump', `[Go to message!](${msg.url})`)
    .setFooter(`#${(msg.channel as GuildChannel).name} quoted by ${user.tag}`)
    .setTimestamp(msg.createdTimestamp);
  if (msg.embeds[0] && attachmentLink == null) {
    const title = msg.embeds[0].title ? msg.embeds[0].title : 'no title';
    embed.addField(`*Contains embed titled: ${title}*`, '\u200b');
    if (msg.embeds[0].image) embed.setImage(msg.embeds[0].image.url);
  }

  if (!embed.image && (msg.attachments.size > 0 ?? !attachmentLink))
    embed.setImage(
      msg.attachments.size > 0 ? msg.attachments.map(a => a.url).filter(item => item)[0] : attachmentLink[0],
    );

  return { embeds: [embed] };
};
