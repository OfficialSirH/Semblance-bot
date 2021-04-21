const mongoose = require('mongoose'),
    { MODELS } = require('../../models'),
    { Votes, Information, Game } = MODELS,
    { MessageEmbed, Collection } = require('discord.js'),
    { c2sGuildID } = require('@semblance/config').default,
    BotList = require('botlist.space');

    let alternateActivity = false;

    function showMyActivity(client) {
        if (!alternateActivity) {
            client.user.setActivity(`s!help in ${client.guilds.cache.size} servers | ${client.commandCounter} commands used during uptime`, { type: "PLAYING" });
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

        setInterval(() => showMyActivity(client), 30000);

        const botListClient = new BotList.Client({ id: client.user.id, botToken: JSON.parse(process.env.botListSpaceAuth).Auth });
        client.setInterval(() => 
        botListClient.postServerCount(client.guilds.cache.size).then((bot) => console.log("Server count post to botlist.space was successful")).catch((err) => console.error(err))
        , 1800000);

        const commands = client.commands;

        /*
        Exclusively cache any users from the game and vote database that aren't already cached
        */
        const cacheList = await Information.findOne({ infoType: 'cacheList' });
        const cacheCollection = new Collection(cacheList.list.map(i => [i, 1]));
        const gameList = await Game.find({});
        gameList.forEach(userData => {
            if (!cacheCollection.has(userData.player)) cacheCollection.set(userData.player);
        });
        const voteList = await Votes.find({});
        voteList.forEach(voteData => {
            if (!cacheCollection.has(voteData.user)) cacheCollection.set(voteData.user);
        });
        const updatedCacheList = await Information.findOneAndUpdate({ infoType: 'cacheList' }, { $set: { list: cacheCollection.keyArray() } }, { new: true });
        console.log(`The cache list has gained ${cacheCollection.size - cacheList.list.length}, which now makes the cache list have a total of ${cacheCollection.size}.`);

        /* Slash Command setup */
        let slash_commands = await client.api.applications(client.user.id).commands.get();
        slash_commands.forEach(command => client.addSlash(command.id, require(`@semblance/slash_commands/${command.name}.js`)));

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

                    client.guilds.cache.get(c2sGuildID).channels.cache.find(c => c.name == 'semblance').send(embed);
                }
            });
        //await CommandCounter.deleteMany({});
        await commands['game'].updateLeaderboard(client);
        await commands['leaderboard'].updateLeaderboard(client);
    
        // client.setInterval(() => {
        //     const UserData = mongoose.model('UserData'), month = (28*24*3600) * 1000;
        //     UserData.find({}, function(err, entries) {
        //         if (err) return console.log(err);
        //         const userdataCollection = new Collection(entries.map(i => [i.discordId, i]));
        //         const removedCount = userdataCollection.sweep(userdata => {
        //             return Date.now() < userdata.created_timestamp + month;
        //         });
        //         const listOfFailedRemovals = [];
        //         userdataCollection.each(userdata => {
        //             UserData.findOneAndDelete({ discordId: userdata.discordId }, (err, entry) => {
        //                 if (err) return listOfFailedRemovals.push(userdata.discordId);
        //             });
        //         });
        //         console.log(`Removed ${removedCount} entries from the UserData API with a total of ${listOfFailedRemovals.length} that failed to be removed.\n\nFailed List: ${listOfFailedRemovals}`);
        //     });
        // }, 3600000);
    });
}