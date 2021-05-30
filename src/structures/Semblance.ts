import { Client, ClientOptions, Collection, Snowflake, TextChannel } from 'discord.js';
import * as fs from 'fs';
import { Information } from '@semblance/models';
import { Commands, Aliases, SlashCommands, SlashCommand } from '@semblance/lib/interfaces/Semblance';
import { RESTManager } from '@semblance/lib/rest/RESTManager';
import { Webhook } from '.';
import { intervalPost } from '@semblance/events';

export class Semblance extends Client {
    private _clearCache: NodeJS.Timeout;
    private _commandCounter: number;
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

        Webhook.client = this;

        this._clearCache = setInterval(() => {
            this.sweepUsers();
        }, 30000);

        this._commandCounter = 0;

        this._autoCommands = {};

        this._slashCommands = {};

        this._commands = {}, this._aliases = {} // { "command": require("that_command") }, { "alias": "command" }
        fs.readdir("./commands/", (err, files) => {
            if (err) return console.log(err);
            for (const file of files) if (file.endsWith(".js")) {
                const commandFile = require(`../commands/${file}`), fileName = file.replace(".js", "");
                this._commands[fileName] = commandFile;
                if (commandFile.aliases) for (const alias of commandFile.aliases) this._aliases[alias] = fileName;
            }
        });

        this._autoCommands = {};
        fs.readdir("./auto_scripts/", (err, files) => {
            if (err) return console.log(err);
            for (const file of files) if (file.endsWith(".js")) {
                const commandFile = require(`../auto_scripts/${file}`), fileName = file.replace(".js", "");
                this._autoCommands[fileName] = commandFile;
            }
        });

        intervalPost(this);

        this._api = new RESTManager(this);
    }

    public sweepUsers = async () => {
        let cacheList = await Information.findOne({ infoType: 'cacheList' });
        const cacheCollection = new Collection(cacheList!.list.map(i => [i, 1]));
        let now = Date.now();
        let cacheLifetime = 30000;
        let users = 0;
        users += this.users.cache.sweep(user => { 
            if (cacheCollection.has(user.id)) return false;
            let channel = this.channels.cache.get((user as any).lastMessageChannelID as string) as TextChannel;
            if (!channel || !channel.messages) return true;
            let lastMessage = channel.messages.cache.get(user.lastMessageID as string);
            if (!lastMessage) return true;
            return (now - (lastMessage.editedTimestamp || lastMessage.createdTimestamp)) > cacheLifetime;
        });
        this.guilds.cache.map(g => g.members.cache).forEach(members => {
            users += members.sweep(member => {
                let channel = this.channels.cache.get(member.lastMessageChannelID as string) as TextChannel;
                if (!channel || !channel.messages) return true;
                let lastMessage = channel.messages.cache.get(member.lastMessageID as string);
                if (!lastMessage) return true;
                return (now - (lastMessage.editedTimestamp || lastMessage.createdTimestamp)) > cacheLifetime;
            });
        });
        return users;
    }

    public get slashCommands() {
        return this._slashCommands;
    }

    public addSlash(id: Snowflake, slashPath: SlashCommand) {
        this._slashCommands[id] = slashPath;
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