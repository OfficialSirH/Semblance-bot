import { Client, ClientOptions, Collection } from 'discord.js';
import * as fs from 'fs';
import { Commands, Aliases, SlashCommands, ComponentHandlers, ContextMenuHandlers } from '@semblance/lib/interfaces/Semblance';
import { RESTManager } from '@semblance/lib/rest/RESTManager';
import { GameLeaderboard, VoteLeaderboard, Webhook } from '.';
import { Game, Votes } from '../models';

export class Semblance extends Client {
    private _gameLeaderboard: GameLeaderboard;
    private _voteLeaderboard: VoteLeaderboard;
    private _commandCounter: number;
    private _componentHandlers: ComponentHandlers;
    private _contextMenuHandlers: ContextMenuHandlers;
    private _slashCommands: SlashCommands;
    private _commands: Commands;
    private _aliases: Aliases;
    private _autoCommands: Commands;
    private _api: RESTManager;
    
    /**
     * 
     * @param options Client options
     */
    constructor(options: object) {
        super(options as ClientOptions);

        this._commandCounter = 0;

        this._autoCommands = {};

        this._componentHandlers = new Collection();
        fs.readdir('./dist/src/componentHandlers/', (err, files) => {
            if (err) return console.log(err);
            for (const file of files) if (file.endsWith('.js')) {
                this._componentHandlers.set(file.replace('.js', ''), require(`../componentHandlers/${file}`));
            }
        });

        this._contextMenuHandlers = new Collection();
        const files = fs.readdirSync('./dist/src/contextMenuHandlers/');
        for (const file of files) if (file.endsWith('.js')) {
            this._contextMenuHandlers.set(file.replace('.js', ''), require(`../contextMenuHandlers/${file}`));
        }

        this._slashCommands = new Collection();

        this._commands = {}, this._aliases = {};
        fs.readdir("./dist/src/commands/", (err, files) => {
            if (err) return console.log(err);
            for (const file of files) if (file.endsWith(".js")) {
                const commandFile = require(`../commands/${file}`), fileName = file.replace(".js", "");
                this._commands[fileName] = commandFile;
                if (commandFile.aliases) for (const alias of commandFile.aliases) this._aliases[alias] = fileName;
            }
        });

        this._autoCommands = {};
        fs.readdir("./dist/src/auto_scripts/", (err, files) => {
            if (err) return console.log(err);
            for (const file of files) if (file.endsWith(".js")) {
                const commandFile = require(`../auto_scripts/${file}`), fileName = file.replace(".js", "");
                this._autoCommands[fileName] = commandFile;
            }
        });

        this._api = new RESTManager(this);
        this._gameLeaderboard = new GameLeaderboard(this);
        this._voteLeaderboard = new VoteLeaderboard(this);
    }

    public async initializeLeaderboards() {
        const gameData = await Game.find({}), voteData = await Votes.find({});
        console.log('Fetched all game and vote data');
        await this._gameLeaderboard.initialize(gameData);
        await this._voteLeaderboard.initialize(voteData);
        console.log('Initialized game and vote leaderboard');
    }

    public get gameLeaderboard() {
        return this._gameLeaderboard;
    }

    public get voteLeaderboard() {
        return this._voteLeaderboard;
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

    public get commands() {
        return this._commands;
    }

    public get aliases() {
        return this._aliases;
    }

    public get autoCommands() {
        return this._autoCommands;
    }

    public get commandCounter() {
        return this._commandCounter;
    }

    public increaseCommandCount() {
        this._commandCounter++;
    }

    public get call() {
        return this._api.api;
    }
}