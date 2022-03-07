import { Client, Guild, GuildChannel, Message, Embed, PartialMessage, Snowflake, TextChannel, User } from 'discord.js';
import type { SapphireClient } from '@sapphire/framework';
import { clamp } from '#lib/utils/math';
import type { AnimalAPIParams, AnimalAPIResponse } from '#lib/interfaces/catAndDogAPI';
import { fetch } from '#lib/utils/fetch';
import type { DeepLParams, DeepLResponse } from '#lib/interfaces/deepLAPI';
import { messageLinkRegex, attachmentLinkRegex } from '#constants/index';
import type { Game } from '@prisma/client';

// gametransfer pages

export const gameTransferPages = [
  'https://i.imgur.com/BsjMAu6.png',
  'https://i.imgur.com/QbDAOkF.png',
  'https://i.imgur.com/w1jEuzh.png',
  'https://i.imgur.com/6qTz2Li.png',
  'https://i.imgur.com/YNBHSw9.png',
];

// bug functions and constants - correctReportList and CHANNELS

export const correctReportList = async function (
  client: SapphireClient,
  message: Message | PartialMessage,
  messageId: Snowflake,
) {
  const deletedReport = await client.db.report.findFirst({ where: { messageId } });
  if (!deletedReport) return;
  const reportList = await client.db.report.findMany({});
  const bugIdList = reportList.filter(r => r.bugId > deletedReport.bugId);

  bugIdList.forEach(async report => {
    const channel = message.guild.channels.cache.get(report.channelId) as TextChannel;
    const msg = await channel.messages.fetch(report.messageId).catch(() => null);

    if (!msg) return console.error("couldn't find message for report id", report.bugId);

    const author = msg.embeds[0].author;
    await msg.edit({
      embeds: [
        msg.embeds[0]
          .setAuthor({
            name: `${author.name.slice(0, author.name.indexOf('\n'))}\nBug Id: #${report.bugId - 1}`,
            iconURL: author.iconURL,
          })
          .setFooter({ text: `#${report.bugId - 1}` }),
      ],
    });
  });

  const updatedReports = await client.db.report.updateMany({
    where: {
      bugId: {
        gt: deletedReport.bugId,
      },
    },
    data: {
      bugId: {
        decrement: 1,
      },
    },
  });

  console.log(`All ${updatedReports.count} reports have successfully been reorganized!`);
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

export function guildBookPage(client: Client, chosenPage: number) {
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
// TODO: figure some way to not need checkedLevel and have the cost automatically adjusted based on the level
export async function currentPrice(client: SapphireClient, userData: Game) {
  if (userData.level == userData.checkedLevel) {
    userData = await client.db.game.update({
      where: {
        player: userData.player,
      },
      data: {
        checkedLevel: {
          increment: 1,
        },
        cost: {
          increment: Math.pow(userData.percentIncrease, userData.level + 1),
        },
      },
    });
    return userData.cost;
  }
  return userData.cost == 0 ? 1 : userData.cost;
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

  const embed = new Embed()
    .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL() })
    .setThumbnail(user.displayAvatarURL())
    .setDescription(msg.content)
    .addField({ name: 'Jump', value: `[Go to message!](${msg.url})` })
    .setFooter({ text: `#${(msg.channel as GuildChannel).name} quoted by ${user.tag}` })
    .setTimestamp(msg.createdTimestamp);
  if (msg.embeds[0] && attachmentLink == null) {
    const title = msg.embeds[0].title ? msg.embeds[0].title : 'no title';
    embed.addField({ name: `*Contains embed titled: ${title}*`, value: '\u200b' });
    if (msg.embeds[0].image) embed.setImage(msg.embeds[0].image.url);
  }

  if (!embed.image && (msg.attachments.size > 0 ?? !attachmentLink))
    embed.setImage(
      msg.attachments.size > 0 ? msg.attachments.map(a => a.url).filter(item => item)[0] : attachmentLink[0],
    );

  return { embeds: [embed] };
};
