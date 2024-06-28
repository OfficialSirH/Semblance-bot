import type { ResultValue } from '#lib/interfaces/Semblance';
import { request } from 'undici';

export async function pullPlayFabData<
  APIResult extends APIPlayFabResults,
  APIJSONBody extends APIPlayFabJSONBodies = APIPlayFabJSONBodies,
>(route: APIPlayFabRoutes, body: APIJSONBody): Promise<ResultValue<boolean, APIResult>> {
  const headers: APIPlayFabHeaders = {
    'X-SecretKey': process.env.PLAYFAB_SECRET_KEY,
  };

  const playerData = await request(`https://${process.env.PLAYFAB_TITLE_ID}.playfabapi.com/Server/${route}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  })
    .then(res => res.body.json() as Promise<APIPlayFabResults | RESTPostAPIPlayFabErrorResult>)
    .catch(e => `Couldn't retrieve the specified player: ${e}`);

  if (typeof playerData == 'string') return { ok: false, message: playerData };

  return playerData.status == 'OK'
    ? { ok: true, value: playerData as APIResult }
    : {
        ok: false,
        message: `There was an issue fetching the inputted Player ID, did you properly copy the id from the game's menu (look at instructions above button)?
If you're sure you did, please contact the bot owner for further assistance.`,
      };
}

export type APIPlayFabResults =
  | RESTPostAPIGetPlayFabPlayerProfileResult
  | RESTPostAPIGetPlayFabPlayerStatisticsResult
  | RESTPostAPIAddGenericIDResult
  | RESTPostAPIGetPlayFabIDsFromGenericIDsResult;

export type APIPlayFabJSONBodies =
  | RESTPostAPIPlayFabJSONBody
  | RESTPostAPIAddGenericIDJSONBody
  | RESTPostAPIGetPlayFabIDsFromGenericIDsJSONBody;

export interface RESTPostAPIPlayFabJSONBody {
  PlayFabId: string;
}

export interface RESTPostAPIPlayFabResult {
  code: number;
  status: string;
}

export interface RESTPostAPIPlayFabOkResult extends RESTPostAPIPlayFabResult {
  status: 'OK';
  data: unknown;
}

export interface RESTPostAPIPlayFabErrorResult extends RESTPostAPIPlayFabResult {
  code: 400;
  status: 'BadRequest';
  error: string;
  errorCode: number;
  errorMessage: string;
  errorDetails: Record<string, string[]>;
}

export interface RESTPostAPIGetPlayFabPlayerProfileResult extends RESTPostAPIPlayFabOkResult {
  data: {
    PlayerProfile: APIPlayFabPlayerProfile;
  };
}

export interface APIPlayFabPlayerProfile {
  PublisherId: string;
  TitleId: string;
  PlayerId: string;
  DisplayName: string;
}

export interface RESTPostAPIGetPlayFabPlayerStatisticsResult extends RESTPostAPIPlayFabOkResult {
  data: {
    PlayFabId: string;
    Statistics: APIPlayFabPlayerStatistics[];
  };
}

export interface APIPlayFabPlayerStatistics {
  StatisticName: APIPlayFabStatisticNames;
  Value: number;
}

export interface RESTPostAPIAddGenericIDResult extends RESTPostAPIPlayFabOkResult {
  data: void;
}

export interface RESTPostAPIAddGenericIDJSONBody extends RESTPostAPIPlayFabJSONBody {
  GenericId: GenericServiceId;
}

export interface RESTPostAPIGetPlayFabIDsFromGenericIDsResult extends RESTPostAPIPlayFabOkResult {
  data: {
    Data: GenericPlayFabIdPair[];
  };
}

export interface GenericPlayFabIdPair {
  GenericId: GenericServiceId;
  PlayFabId?: string;
}

export interface RESTPostAPIGetPlayFabIDsFromGenericIDsJSONBody {
  /** the size limit is 10 */
  GenericIDs: GenericServiceId[];
}

export interface GenericServiceId {
  ServiceName: 'discord';
  UserId: string;
}

/**
 * Notes for each statistic:
 *
 * `IsBeta` - 0 is false, 1 is true
 *
 * `Bdg{event_name}` - 3 badges concatenated in a single number, separated by 0s except when a badge is greater than 9.
 *  Value is 0 if player doesn't have any badges from the event
 *
 * `Beyond` - Rank in Beyond Simulation
 * `Dino` - Rank in Dino Simulation
 * `DinoPrestige` - Prestige rank in Dino Simulation
 * `Metabit` - Metabit count
 * `Playtime` - Playtime in minutes
 * `Reboot` - Reboot count
 * `Rp` - RP count
 * `Speedrun` - Main simulation speedrun time in milliseconds
 */
export enum APIPlayFabStatisticNames {
  IsBeta = 'is_beta',
  AchBeyond = 'ach_beyond',
  AchDino = 'ach_dino',
  AchMain = 'ach_main',
  AchStars = 'ach_stars',
  BdgArt = 'bdg_art',
  BdgExtinct = 'bdg_extinct',
  BdgFungi = 'bdg_fungi',
  BdgHuman = 'bdg_human',
  BdgMoney = 'bdg_money',
  BdgMusic = 'bdg_music',
  BdgOcean = 'bdg_ocean',
  BdgPhilo = 'bdg_philo',
  BdgPollen = 'bdg_pollen',
  BdgTea = 'bdg_tea',
  BdgWebb = 'bdg_webb',
  Beyond = 'beyond',
  Dino = 'dino',
  DinoPrestige = 'dinoprestige',
  Metabit = 'metabit',
  Playtime = 'playtime',
  Reboot = 'reboot',
  Rp = 'rp',
  Speedrun = 'speedrun',
  TierOverallNumeric = 'tierOverallNumeric',
  Cheat = 'cheat',
  CurrentDarwinium = 'current_darwinium',
}

export enum APIPlayFabRoutes {
  GetPlayerProfile = 'GetPlayerProfile',
  GetPlayerStatistics = 'GetPlayerStatistics',
  AddGenericID = 'AddGenericID',
  GetPlayFabIDsFromGenericIDs = 'GetPlayFabIDsFromGenericIDs',
}

export interface APIPlayFabHeaders {
  'X-SecretKey': string;
}

// TODO: add all the actual names of the events
export const EventNamesMapping: Record<APIPlayFabStatisticNames & `bdg_${string}`, string> = {
  [APIPlayFabStatisticNames.BdgArt]: 'Art',
  [APIPlayFabStatisticNames.BdgExtinct]: 'Extinct',
  [APIPlayFabStatisticNames.BdgFungi]: 'Fungi',
  [APIPlayFabStatisticNames.BdgHuman]: 'Human',
  [APIPlayFabStatisticNames.BdgMoney]: 'Money',
  [APIPlayFabStatisticNames.BdgMusic]: 'Music',
  [APIPlayFabStatisticNames.BdgOcean]: 'Ocean',
  [APIPlayFabStatisticNames.BdgPhilo]: 'Philo',
  [APIPlayFabStatisticNames.BdgPollen]: 'Pollen',
  [APIPlayFabStatisticNames.BdgTea]: 'Tea',
  [APIPlayFabStatisticNames.BdgWebb]: 'Webb',
};
