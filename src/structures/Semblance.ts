import type {
  AutocompleteHandler,
  ContextMenuHandler,
  SlashCommand,
  ComponentHandler,
  Command,
  Category,
  QueriedInfoBuilder,
} from '#lib/interfaces/Semblance';
import type { ClientOptions } from 'discord.js';
import { Client, Collection } from 'discord.js';
import * as fs from 'fs';
// import { GameLeaderboard, VoteLeaderboard } from '#structures/index';
// import { Game, Votes } from '#models/index';
import prisma from '@prisma/client';

export class Semblance extends Client {
  private _db: prisma.PrismaClient;
  // private _gameLeaderboard: GameLeaderboard;
  // private _voteLeaderboard: VoteLeaderboard;
  private _componentHandlers: Collection<string, ComponentHandler>;
  private _contextMenuHandlers: Collection<string, ContextMenuHandler>;
  private _autocompleteHandlers: Collection<string, AutocompleteHandler>;
  private _infoBuilders: Collection<string, QueriedInfoBuilder>;
  private _slashCommands: Collection<string, SlashCommand>;
  private _commands: Record<string, Command<Category>>;
  private _aliases: Record<string, string>;

  /**
   *
   * @param options Client options
   */
  constructor(options: ClientOptions) {
    super(options);

    this._db = new prisma.PrismaClient();

    this._componentHandlers = new Collection();
    fs.readdir('./dist/src/applicationCommands/componentHandlers/', async (err, files) => {
      if (err) return console.log(err);
      for (const file of files)
        if (file.endsWith('.js')) {
          this._componentHandlers.set(
            file.replace('.js', ''),
            (await import(`../applicationCommands/componentHandlers/${file}`)).default,
          );
        }
    });

    this._contextMenuHandlers = new Collection();
    fs.readdir('./dist/src/applicationCommands/contextMenuHandlers/', async (err, files) => {
      if (err) return console.log(err);
      for (const file of files)
        if (file.endsWith('.js')) {
          this._contextMenuHandlers.set(
            file.replace('.js', ''),
            await import(`../applicationCommands/contextMenuHandlers/${file}`),
          );
        }
    });

    this._autocompleteHandlers = new Collection();
    fs.readdir('./dist/src/applicationCommands/autocompleteHandlers/', async (err, files) => {
      if (err) return console.log(err);
      for (const file of files)
        if (file.endsWith('.js')) {
          this._autocompleteHandlers.set(
            file.replace('.js', ''),
            await import(`../applicationCommands/autocompleteHandlers/${file}`),
          );
        }
    });

    this._slashCommands = new Collection();
    this._infoBuilders = new Collection();

    (this._commands = {}), (this._aliases = {});
    fs.readdir('./dist/src/commands/', async (err, files) => {
      if (err) return console.log(err);
      for (const file of files)
        if (file.endsWith('.js')) {
          const commandFile = (await import(`../commands/${file}`)).default,
            fileName = file.replace('.js', '');
          this._commands[fileName] = commandFile;
          if (commandFile.aliases) for (const alias of commandFile.aliases) this._aliases[alias] = fileName;
        }
    });

    // this._gameLeaderboard = new GameLeaderboard(this);
    // this._voteLeaderboard = new VoteLeaderboard(this);
  }

  public get db() {
    return this._db;
  }

  // public async initializeLeaderboards() {
  //   const gameData = await Game.find({}),
  //     voteData = await Votes.find({});
  //   console.log('Fetched all game and vote data');
  //   await this._gameLeaderboard.initialize(gameData);
  //   await this._voteLeaderboard.initialize(voteData);
  //   console.log('Initialized game and vote leaderboard');
  // }

  // public get gameLeaderboard() {
  //   return this._gameLeaderboard;
  // }

  // public get voteLeaderboard() {
  //   return this._voteLeaderboard;
  // }

  public get autocompleteHandlers() {
    return this._autocompleteHandlers;
  }

  public get componentHandlers() {
    return this._componentHandlers;
  }

  public get contextMenuHandlers() {
    return this._contextMenuHandlers;
  }

  public get slashCommands() {
    return this._slashCommands;
  }

  public get infoBuilders() {
    return this._infoBuilders;
  }

  public get commands() {
    return this._commands;
  }

  public get aliases() {
    return this._aliases;
  }
}
