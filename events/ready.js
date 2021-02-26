const { GameModel } = require('../commands/game.js'),
    Votes = require('../models/Votes.js'),
    { Information } = require('../commands/edit'),
    { MessageEmbed } = require('discord.js');

    let topGG;
    let discordBoats;

    let alternateActivity = false;
    let totalCommandsUsed = 0;
    
    function showMyActivity(client) {
        if (!alternateActivity) {
            client.user.setActivity(`s!help in ${client.guilds.cache.size} servers | ${totalCommandsUsed} commands used during uptime`, { type: "PLAYING" });
            alternateActivity = true;
        } else {
            alternateActivity = false;
            let totalMembers = client.guilds.cache.map(g => g.memberCount).filter(g => g).reduce((total, cur, ind) => total += cur, 0);
            client.user.setActivity(`s!help in ${client.guilds.cache.size} servers | ${totalMembers} members`, { type: "PLAYING" });
        }
    }

module.exports = (client) => {
    client.on("ready", async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        setTimeout(function () {
            topGG = require("../commands/websiteScripts/topGG.js");
            topGG.FixClient(client);
            discordBoats = require("../commands/websiteScripts/DiscordBoat.js");
            discordBoats(client);
        }, 500);

        setInterval(() => { 
            if (!alternateActivity) {
                client.user.setActivity(`s!help in ${client.guilds.cache.size} servers | ${totalCommandsUsed} commands used during uptime`, { type: "PLAYING" });
                alternateActivity = true;
            } else {
                alternateActivity = false;
                let totalMembers = client.guilds.cache.map(g => g.memberCount).filter(g => g).reduce((total, cur, ind) => total += cur, 0);
                client.user.setActivity(`s!help in ${client.guilds.cache.size} servers | ${totalMembers} members`, { type: "PLAYING" });
            }
         }, 30000);

        const commands = client.commands;

        /*
        Exclusively cache any users from the game and vote database that aren't already cached
        */
        const cacheList = await Information.findOne({ infoType: 'cacheList' });
        let newCachedUsers = [];
        const gameList = await GameModel.find({});
        gameList.forEach(userData => {
            if (!cacheList.list.includes(userData.player)) newCachedUsers.push(userData.player);
        });
        const voteList = await Votes.find({});
        voteList.forEach(voteData => {
            if (!cacheList.list.includes(voteData.user)) newCachedUsers.push(voteData.user);
        });
        let newCacheList = [...cacheList.list, ...newCachedUsers];
        let updatedCacheList = await Information.findOneAndUpdate({ infoType: 'cacheList' }, { $set: { list: newCacheList } }, { new: true });
        console.log(`The cache list has gained ${newCachedUsers.length}, which now makes the cache list have a total of ${updatedCacheList.list.length}.`);

        /* Slash Command setup */
        let slash_commands = await client.api.applications(client.user.id).commands.get();
        slash_commands.forEach(command => client.addSlash(command.id, require(`../slash_commands/${command.name}.js`)));

        /*
        * Reminder check
        */

        setInterval(() => { commands['remindme'].checkReminders(client) }, 60000);

        Information.findOne({ infoType: "github" })
            .then(async (infoHandler) => {
                if (infoHandler.updated) {
                    await Information.findOneAndUpdate({ infoType: "github" }, { $set: { updated: false } }, { new: true });
                    let embed = new MessageEmbed()
                        .setTitle("Semblance Update")
                        .setColor("RANDOM")
                        .setAuthor(client.user.tag, client.user.displayAvatarURL())
                        .setDescription(`**${infoHandler.info}**`);

                    client.guilds.cache.get(c2sID).channels.cache.find(c => c.name == 'semblance').send(embed);
                }
            });
        //await CommandCounter.deleteMany({});
        await commands['game'].updateLeaderboard(client);
        await commands['leaderboard'].updateLeaderboard(client);
        });
}