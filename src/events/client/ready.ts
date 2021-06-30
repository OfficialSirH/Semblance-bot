import { Votes, Information, Game } from '@semblance/models';
import { MessageEmbed, Collection, TextChannel } from 'discord.js';
import config from '@semblance/config';
import { Semblance } from '@semblance/src/structures';
import {
    checkReminders,
    randomColor
} from '@semblance/constants';
import { intervalPost } from '..';
const { c2sGuildID, prefix } = config;

    let alternateActivity = false;

    function showMyActivity(client: Semblance) {
        if (!alternateActivity) {
            client.user.setActivity(`${prefix}help in ${client.guilds.cache.size} servers | ${client.commandCounter} commands used during uptime`, { type: "PLAYING" });
            alternateActivity = true;
        } else {
            alternateActivity = false;
            let totalMembers = client.guilds.cache.map(g => g.memberCount).filter(g => g).reduce((total, cur, ind) => total += cur, 0);
            client.user.setActivity(`${prefix}help in ${client.guilds.cache.size} servers | ${totalMembers} members`, { type: "PLAYING" });
        }
    }

export const ready = (client: Semblance) => {
    client.on("ready", async () => {
        console.log(`Logged in as ${client.user.tag}!`);

        setInterval(() => showMyActivity(client), 30000);

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
        let slash_commands = await client.application.commands.fetch();
        slash_commands.forEach(command => client.slashCommands.set(command.id, require(`@semblance/src/slash_commands/${command.name}.js`)));

        /*
        * Reminder check
        */

        client.setInterval(() => { checkReminders(client) }, 60000);

        Information.findOne({ infoType: "github" })
            .then(async (infoHandler) => {
                if (infoHandler.updated) {
                    await Information.findOneAndUpdate({ infoType: "github" }, { $set: { updated: false } }, { new: true });
                    let embed = new MessageEmbed()
                        .setTitle("Semblance Update")
                        .setColor(randomColor)
                        .setAuthor(client.user.tag, client.user.displayAvatarURL())
                        .setDescription(`**${infoHandler.info}**`);

                    (client.guilds.cache.get(c2sGuildID).channels.cache.find(c => c.name == 'semblance') as TextChannel).send({ embeds: [embed] });
                }
            });
        
        await client.initializeLeaderboards();
        intervalPost(client);
    });
}