import type { Client } from '#structures/Client';
import { clamp } from '#lib/utils/math';
import type { AnimalAPIParams, AnimalAPIResponse } from '#lib/interfaces/catAndDogAPI';
import type { DeepLParams, DeepLResponse } from '#lib/interfaces/deepLAPI';
import type { Game } from '@prisma/client';
import { request } from 'undici';
import type { APIGuild, Snowflake } from '@discordjs/core';

// gametransfer pages

export const gameTransferPages = [
  'https://i.imgur.com/BsjMAu6.png',
  'https://i.imgur.com/QbDAOkF.png',
  'https://i.imgur.com/w1jEuzh.png',
  'https://i.imgur.com/6qTz2Li.png',
  'https://i.imgur.com/YNBHSw9.png',
];

// Serverlist function - Guild Book

export const serversPerPage = 50;

export function guildBookPage(client: Client, chosenPage: number) {
  const guildBook: Record<string, Record<string, string>> = {},
    numOfPages = Math.ceil(client.cache.data.guilds.size / serversPerPage);

  if (!chosenPage) chosenPage = 1;
  else chosenPage = clamp(chosenPage, 1, numOfPages);

  for (let i = 0; i < numOfPages; i++) {
    guildBook[`page_${i + 1}`] = {};
    const loopCount =
      client.cache.data.guilds.size < serversPerPage - 1 + i * serversPerPage
        ? client.cache.data.guilds.size - 1
        : serversPerPage - 1 + i * serversPerPage;
    for (let j = serversPerPage * i; j <= loopCount; j++)
      guildBook[`page_${i + 1}`][`${client.cache.data.guilds.map(c => c as APIGuild)[j].name}`] = `${
        client.cache.data.guilds.map(c => c)[j].id
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

  return (await request(API_URL, { headers: { 'X-API-KEY': API_KEY } })).body.json() as Promise<AnimalAPIResponse>;
};

// deepL API fetch
export const fetchDeepL = async (query_params: DeepLParams) => {
  query_params.target_lang = 'en-US';
  query_params.auth_key = process.env.DEEPL_API_KEY;
  const API_URL = `https://api-free.deepl.com/v2/translate?${new URLSearchParams(
    query_params as Record<string, string>,
  )}`;
  const translateData = (await (await request(API_URL)).body.json()) as DeepLResponse;
  return translateData.translations[0];
};

// game - currentPrice
// TODO: figure some way to not need checkedLevel and have the cost automatically adjusted based on the level
export async function currentPrice(client: Client, userData: Game) {
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

// Suggestion constants
export const SuggestionConstants = {
  // // half an hour
  // AttachmentCacheLifetime: 1000 * 60 * 30,
  // // max attachments in cache
  // AttachmentCacheLimit: 10,
  // unique key for identifying denied suggestions
  createUniqueKey: (userId: Snowflake, suggestion: string) =>
    `${userId}-${suggestion.slice(-4)}` as `${Snowflake}-${string}`,
  // quarter of an hour
  DeniedSuggestionCacheLifetime: 1000 * 60 * 15,
  // max denied suggestions in cache (if this somehow reaches the limit, I did something terribly wrong)
  DeniedSuggestionsCacheLimit: 5,
};
