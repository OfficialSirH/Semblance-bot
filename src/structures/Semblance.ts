import { Client, ClientOptions, Collection } from 'discord.js';
import * as fs from 'fs';
import type { Commands, Aliases, AutocompleteHandler, ContextMenuHandler, SlashCommand, ComponentHandler } from '@semblance/lib/interfaces/Semblance';
import { GameLeaderboard, VoteLeaderboard } from '.';
import { Game, Votes } from '../models';

export class Semblance extends Client {
    private _gameLeaderboard: GameLeaderboard;
    private _voteLeaderboard: VoteLeaderboard;
    private _componentHandlers: Collection<string, ComponentHandler>;
    private _contextMenuHandlers: Collection<string, ContextMenuHandler>;
    private _autocompleteHandlers: Collection<string, AutocompleteHandler>;
    private _slashCommands: Collection<string, SlashCommand>;
    private _commands: Commands;
    private _aliases: Aliases;
    private _autoCommands: Commands;
    
    /**
     * 
     * @param options Client options
     */
    constructor(options: ClientOptions) {
        super(options);

        this._componentHandlers = new Collection();
        fs.readdir('./dist/src/applicationCommands/componentHandlers/', (err, files) => {
            if (err) return console.log(err);
            for (const file of files) if (file.endsWith('.js')) {
                this._componentHandlers.set(file.replace('.js', ''), require(`../applicationCommands/componentHandlers/${file}`));
            }
        });

        this._contextMenuHandlers = new Collection();
        const contextMenuFiles = fs.readdirSync('./dist/src/applicationCommands/contextMenuHandlers/');
        for (const file of contextMenuFiles) if (file.endsWith('.js')) {
            this._contextMenuHandlers.set(file.replace('.js', ''), require(`../applicationCommands/contextMenuHandlers/${file}`));
        }

        this._autocompleteHandlers = new Collection();
        const autocompleteFiles = fs.readdirSync('./dist/src/applicationCommands/autocompleteHandlers/');
        for (const file of autocompleteFiles) if (file.endsWith('.js')) {
            this._autocompleteHandlers.set(file.replace('.js', ''), require(`../applicationCommands/autocompleteHandlers/${file}`));
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
        fs.readdir("./dist/src/autoActions/", (err, files) => {
            if (err) return console.log(err);
            for (const file of files) if (file.endsWith(".js")) {
                const commandFile = require(`../autoActions/${file}`), fileName = file.replace(".js", "");
                this._autoCommands[fileName] = commandFile;
            }
        });

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

    public get commands() {
        return this._commands;
    }

    public get aliases() {
        return this._aliases;
    }

    public get autoCommands() {
        return this._autoCommands;
    }

    public get call() {
        return this['api'];
    }
}