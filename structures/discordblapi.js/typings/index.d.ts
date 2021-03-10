export = DiscordBLAPI;
import { EventEmitter } from 'events';

declare class DiscordBLAPI extends EventEmitter {
  constructor(token: string, options: DiscordBLAPI.DiscordBLOptions, client?: object);
  constructor(token: string, client?: object);

  public webhook?: DiscordBLWebhook;
  public postStats(
    guilds: number,
    shardId?: number,
    // shardCount?: number
  ): Promise<object>;
  public getStats(id: string): Promise<DiscordBLAPI.BotStats>;
  public getBot(id: string): Promise<DiscordBLAPI.Bot>;
  public getUser(id: string): Promise<DiscordBLAPI.User>;
  public getBots(query: DiscordBLAPI.BotsQuery): Promise<DiscordBLAPI.BotSearchResult>; // Not likely to work with DiscordBL
  //public getVotes(): Promise<DiscordBLAPI.Vote>;
  public hasVoted(id: string): Promise<boolean>;

  public token?: string;

  private _request(
    method: string,
    endpoint: string,
    data?: object
  ): Promise<object>;

  public on(event: 'posted', listener: () => void): this;
  public on(event: 'error', listener: (error: Error) => void): this;
}

import { Server, ServerResponse, IncomingMessage } from 'http';
declare class DiscordBLWebhook extends EventEmitter {
  constructor(port?: number, path?: string, auth?: string, server?: Server);

  public port: number;
  public path: string;
  public auth?: string;
  private _server: Server;
  private attached: boolean;
  private _emitListening(): void;
  private _startWebhook(): void;
  private _attachWebhook(server: Server): void;
  private _handleRequest(req: IncomingMessage, res: ServerResponse): void;
  private _returnResponse(
    res: ServerResponse,
    statusCode: number,
    data?: string
  ): void;

  public on(
    event: 'ready',
    listener: (hook: DiscordBLAPI.ReadyEventArgs) => void
  ): this;
  public on(
    event: 'vote',
    listener: (vote: DiscordBLAPI.VoteEventArgs) => void
  ): this;
}

declare namespace DiscordBLAPI {
  export type DiscordBLOptions = {
    statsInterval?: number;
    webhookPort?: number;
    webhookAuth?: string;
    webhookPath?: string;
    webhookServer?: Server;
  };

  export type BotStats = {
    server_count: number;
    shards: number[];
    shard_count: number;
  };

  export type Bot = {
    id: number;
    username: string;
    discriminator: string;
    avatar?: string;
    defAvatar: string;
    lib: string;
    prefix: string;
    shortdesc: string;
    longdesc?: string;
    tags: string[];
    website?: string;
    support?: string;
    github?: string;
    owners: number[];
    invite?: string;
    date: Date;
    certifiedBot: boolean;
    vanity?: string;
    points: number;
  };

  export type User = {
    id: number;
    username: string;
    discriminator: string;
    avatar?: string;
    defAvatar: string;
    bio?: string;
    banner?: string;
    social: UserSocial;
    color?: string;
    supporter: boolean;
    certifiedDev: boolean;
    mod: boolean;
    webMod: boolean;
    admin: boolean;
  };

  export type UserSocial = {
    youtube?: string;
    reddit?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  };

  export type BotsQuery = {
    limit?: number;
    offset?: number;
    search: string;
    sort: string;
    fields?: string;
  };

  export type BotSearchResult = {
    results: Bot[];
    limit: number;
    offset: number;
    count: number;
    total: number;
  };

  /*export type Vote = {
    hasVoted: string[],
    hasVoted24: string[],
    votes: number,
    votes24: number,
    votesMonth: number
  };*/

  export type VoteEventArgs = {
    admin: boolean;
    avatar: string;
    username: string;
    id: string;
  };

  export type ReadyEventArgs = {
    hostname: string;
    port: number;
    path: string;
  };
}
