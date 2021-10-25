import type { Snowflake } from 'discord.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

export interface APIOptions {
  /**
   * discords.com Token
   */
  token?: string;
}
export interface BotInfo {
  /**
   * The timestamp of when the bot was added
   */
  added: number;
  /**
   * The bot's approved status
   */
  approved: boolean;
  /**
   * The timestamp of when the bot was approved
   */
  approvedTime?: number;
  /**
   * The id of the bot
   */
  id: Snowflake;
  /**
   * The username of the bot
   */
  name: string;
  /**
   * The bot's nsfw status
   */
  nsfw: boolean;
  /**
   * The discriminator of the bot
   */
  discrim: string;
  /**
   * Bot's page color
   */
  color: string;
  /**
   * The avatar hash of the bot's avatar
   */
  avatar?: string;
  /**
   * The URL for the vanity url
   */
  vanityUrl?: string;
  /**
   * The library of the bot
   */
  library: string;
  /**
   * The prefix of the bot
   */
  prefix: string;
  /**
   * The short description of the bot
   */
  shortdesc: string;
  /**
   * The long description of the bot. Can contain HTML and/or Markdown
   */
  longdesc: string;
  /**
   * The bot's discord tag
   */
  tag: string;
  /**
   * The tags of the bot
   */
  tags: string[];
  /**
   * The bot's discord status
   */
  status: string;
  /**
   * The amount of servers that the bot is in
   */
  server_count: number;
  /**
   * Bot has a website
   */
  website_bot?: boolean;
  /**
   * The support server invite code of the bot
   */
  support_server?: string;
  /**
   * The link to the github repo of the bot
   */
  github?: string;
  /**
   * The main owner of the bot
   */
  owner: string;
  /**
   * The secondary owners of the bot.
   */
  owners: Snowflake[];
  /**
   * The bot's invite url
   */
  invite?: string;
  /**
   * The verified status of the bot
   */
  verified: boolean;
  /**
   * The partner status of the bot
   */
  partner: boolean;
  /**
   * The featured status of the bot
   */
  featured: boolean;
  /**
   * The amount of votes the bot has
   */
  votes: number;
  /**
   * The amount of votes the bot has this 24 hours
   */
  votes24: number;
  /**
   * The amount of votes the bot has this month
   */
  votesMonth: number;
}
export interface BotStats {
  /**
   * The amount of servers the bot is in
   */
  server_count?: number;
}
export interface UserInfo {
  /**
   * The id of the user
   */
  id: Snowflake;
  /**
   * The username of the user
   */
  username: string;
  /**
   * The discriminator of the user
   */
  discrim: string;
  /**
   * The tag of the user
   */
  tag: string;
  /**
   * The avatar hash of the user's avatar
   */
  avatar?: string;
  /**
   * The bio of the user
   */
  bio?: string;
  /**
   * The background image url of the user
   */
  background?: string;
  /**
   * The discord status of the user
   */
  status: string;
  /**
   * The user's flags
   */
  flags: number;
  /**
   * The user's house
   */
  house: string;
  /**
   * The user's website
   */
  website: string;
  /**
   * The covidFund status of the user
   */
  covidFund: boolean;
  /**
   * The teamTrees status of the user
   */
  teamTrees: boolean;
  /**
   * The partner status of the user
   */
  isPartner: boolean;
  /**
   * The beta status of the user
   */
  isBeta: boolean;
  /**
   * The jrMod status of the user
   */
  isJrMod: boolean;
  /**
   * The website moderator status of the user
   */
  isMod: boolean;
  /**
   * The admin status of the user
   */
  isAdmin: boolean;
}
export interface UserBots {
  /**
   * list of bots owned by this user
   */
  bots: Snowflake[];
}
export interface BotsResponse {
  /**
   * The matching bots
   */
  results: BotInfo[];
  /**
   * The limit used
   */
  limit: number;
  /**
   * The offset used
   */
  offset: number;
  /**
   * The length of the results array
   */
  count: number;
  /**
   * The total number of bots matching your search
   */
  total: number;
}
export interface BotVotes {
  /**
   * Array of user Ids
   */
  hasVoted: Snowflake[];
  /**
   * Array of user Ids that voted last 24 hours
   */
  hasVoted24: Snowflake[];
  /**
   * Vote count
   */
  votes: number;
  /**
   * vote count last 24 hours
   */
  votes24: number;
  /**
   * vote count this month
   */
  votesMonth: number;
}
/**
 * The bot's widget
 */
export type Widget = string;
export interface votes {
  /**
   * total number of votes
   */
  totalVotes: number;
  /**
   * total number of votes last 24 hours
   */
  votes24: number;
  /**
   * total number of votes this month
   */
  votesMonth: number;
  /**
   * snowflakes(Ids) of all users who have voted
   */
  hasVoted?: Snowflake[];
  /**
   * snowflakes(Ids) of all user who have voted the last 24 hours
   */
  hasVoted24?: Snowflake[];
}
export interface DiscordsVote {
  /**
   * The Id of the user who voted
   */
  user: Snowflake;
  /**
   * The Id of the bot that the user voted for
   */
  bot: Snowflake;
  /**
   * List of all voted users and vote counts for the bot
   */
  votes: votes;
  /**
   * type of vote
   */
  type: 'vote' | 'test';
}

export type DiscordsRequest = FastifyRequest<{ Body: DiscordsVote }>;
