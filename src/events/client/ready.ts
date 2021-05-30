import { Votes, Information, Game } from '@semblance/models';
import { MessageEmbed, Collection, TextChannel } from 'discord.js';
import config from '@semblance/config';
import { Semblance } from '@semblance/src/structures';
import {
    updateGameLeaderboard,
    updateVoteLeaderboard,
    checkReminders,
    randomColor
} from '@semblance/constants';
const { c2sGuildID } = config;

    let alternateActivity = false;

    function showMyActivity(client: Semblance) {
        if (!alternateActivity) {
            client.user.setActivity(`s!help in ${client.guilds.cache.size} servers | ${client.commandCounter} commands used during uptime`, { type: "PLAYING" });
            alternateActivity = true;
        } else {
            alternateActivity = false;
            let totalMembers = client.guilds.cache.map(g => g.memberCount).filter(g => g).reduce((total, cur, ind) => total += cur, 0);
            client.user.setActivity(`s!help in ${client.guilds.cache.size} servers | ${totalMembers} members`, { type: "PLAYING" });
        }
    }

export const ready = (client: Semblance) => {
    client.on("ready", async () => {
        console.log(`Logged in as ${client.user.tag}!`);

        setInterval(() => showMyActivity(client), 30000);

        const commands = client.commands;

        /*
        Exclusively cache any users from the game and vote database that aren't already cached
        */
        const cacheList = await Information.findOne({ infoType: 'cacheList' });
        const cacheCollection = new Collection(cacheList.list.map(i => [i, 1]));
        const gameList = await Game.find({});
        gameList.forEach(userData => {
            if (!cacheCollection.has(userData.player)) cacheCollection.set(userData.player, 1);
        });
        const voteList = await Votes.find({});
        voteList.forEach(voteData => {
            if (!cacheCollection.has(voteData.user)) cacheCollection.set(voteData.user, 1);
        });
        const updatedCacheList = await Information.findOneAndUpdate({ infoType: 'cacheList' }, { $set: { list: cacheCollection.keyArray() } }, { new: true });
        console.log(`The cache list has gained ${cacheCollection.size - cacheList.list.length}, which now makes the cache list have a total of ${cacheCollection.size}.`);

        /* Slash Command setup */
        let slash_commands = await client.call.applications(client.user.id).commands.get();
        slash_commands.forEach(command => client.addSlash(command.id, require(`@semblance/events/slash_commands/${command.name}.js`)));

        /*
        * Reminder check
        */

        setInterval(() => { checkReminders(client) }, 60000);

        Information.findOne({ infoType: "github" })
            .then(async (infoHandler) => {
                if (infoHandler.updated) {
                    await Information.findOneAndUpdate({ infoType: "github" }, { $set: { updated: false } }, { new: true });
                    let embed = new MessageEmbed()
                        .setTitle("Semblance Update")
                        .setColor(randomColor)
                        .setAuthor(client.user.tag, client.user.displayAvatarURL())
                        .setDescription(`**${infoHandler.info}**`);

                    (client.guilds.cache.get(c2sGuildID).channels.cache.find(c => c.name == 'semblance') as TextChannel).send(embed);
                }
            });
        //await CommandCounter.deleteMany({});
        await updateGameLeaderboard(client);
        await updateVoteLeaderboard(client);
    
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