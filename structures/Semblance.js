const { Client, Collection } = require('discord.js'), fs = require('fs'), { Information } = require('../commands/edit.js');

module.exports.Semblance = class Semblance extends Client {
    constructor(options) {
        super(options);

        this.clear_cache = setInterval(() => {
            this.sweepUsers();
        }, 30000);

        this.command_counter = 0;

        this.slash_commands = {};

        this._commands = {}, this._aliases = {} // { "command": require("that_command") }, { "alias": "command" }
        fs.readdir("./commands/", (err, files) => {
            if (err) return console.log(err);
            for (const file of files) if (file.endsWith(".js")) {
                const commandFile = require(`../commands/${file}`), fileName = file.replace(".js", "");
                this._commands[fileName] = commandFile;
                if (commandFile.aliases) for (const alias of commandFile.aliases) this._aliases[alias] = fileName;
            }
        });

        this.auto_commands = {};
        fs.readdir("./auto_scripts/", (err, files) => {
            if (err) return console.log(err);
            for (const file of files) if (file.endsWith(".js")) {
                const commandFile = require(`../auto_scripts/${file}`), fileName = file.replace(".js", "");
                this.auto_commands[fileName] = commandFile;
            }
        });
    }

    sweepUsers = async () => {
        let cacheList = await Information.findOne({ infoType: 'cacheList' });
        const cacheCollection = new Collection(cacheList.list.map(i => [i, 1]));
        let now = Date.now();
        let cacheLifetime = 30000;
        let users = 0;
        users += this.users.cache.sweep(user => { 
            if (cacheCollection.has(user.id)) return false;
            let channel = this.channels.cache.get(user.lastMessageChannelID);
            if (!channel || !channel.messages) return true;
            let lastMessage = channel.messages.cache.get(user.lastMessageID);
            if (!lastMessage) return true;
            return (now - (lastMessage.editedTimestamp || lastMessage.createdTimestamp)) > cacheLifetime;
        });
        this.guilds.cache.map(g => g.members.cache).forEach(members => {
            users += members.sweep(member => {
                let channel = this.channels.cache.get(member.lastMessageChannelID);
                if (!channel || !channel.messages) return true;
                let lastMessage = channel.messages.cache.get(member.lastMessageID);
                if (!lastMessage) return true;
                return (now - (lastMessage.editedTimestamp || lastMessage.createdTimestamp)) > cacheLifetime;
            });
        });
        return users;
    }

    get slashCommands() {
        return this.slash_commands;
    }

    addSlash(id, slashPath) {
        this.slash_commands[id] = slashPath;
    }

    get commands() {
        return this._commands;
    }

    get aliases() {
        return this._aliases;
    }

    get autoCommands() {
        return this.auto_commands;
    }

    get commandCounter() {
        return this.command_counter;
    }

    increaseCommandCount() {
        this.command_counter++;
    }
}