import fetch from 'node-fetch';
import { BFDApi, DBLApi, Semblance } from '@semblance/structures';
import * as BotList from 'botlist.space';
import { Client } from '@semblance/lib/interfaces/botListSpace';
import BOATS from 'boats.js';
import * as TopggSDK from '@top-gg/sdk';

export const intervalPost = (client: Semblance) => {

    const baseURL = 'https://discord.bots.gg/api/v1';
    setInterval(async function() {
        const data = { guildCount: client.guilds.cache.size };
        const r = await (await fetch(baseURL + '/bots/' + client.user.id + '/stats', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(process.env.discordBotsGGAuth).Auth
            },
            body: JSON.stringify(data)
        })).json();
        console.log(`discord.bots.gg response: ${r ? `guilds: ${r.guildCount} - shards: ${r.shardCount}` : r}`);
    }, 1800000);
    
    
    
    const bfd = new BFDApi(JSON.parse(process.env.botsForDiscordAuth).Auth);
            setInterval(() => {
                bfd.postStats(client.guilds.cache.size);
    }, 1800000);
    
    
    const botListClient = new BotList.Client({ id: client.user.id, botToken: JSON.parse(process.env.botListSpaceAuth).Auth }) as Client;
            client.setInterval(() => 
            botListClient.postServerCount(client.guilds.cache.size).then(() => console.log("Server count post to botlist.space was successful")).catch((err) => console.error(err))
    , 1800000);
    
    
    const Boats = new BOATS(JSON.parse(process.env.DBoatsAuth).Auth);
    setInterval(function () {
        Boats.postStats(client.guilds.cache.size, client.user.id).then(() => {
            console.log('Successfully updated server count.');
        }).catch((err) => {
            console.error(err);
        });
    }, 1800000);
    
    
    const dbl = new DBLApi(JSON.parse(process.env.discordBotListAuth).Auth);
    setInterval(() => {
        if (client.shard != null && client.shard)
            dbl.postStats({
                users: client.guilds.cache.reduce((acc, cur, ind) => acc += cur.memberCount, 0),
                guilds: client.guilds.cache.size,
                shard_id: client.shard.ids[0]
            });
        else 
            dbl.postStats({
                users: client.guilds.cache.reduce((acc, cur, ind) => acc += cur.memberCount, 0),
                guilds: client.guilds.cache.size
            });
    }, 1800000);
    
    
    const tpgg = new TopggSDK.Api(JSON.parse(process.env.topGGAuth).Auth);
    setInterval(() => {
        if (client.shard != null && client.shard) {
            tpgg.postStats({
                serverCount: client.guilds.cache.size,
                shardId: client.shard.ids[0],
                shardCount: client.options.shardCount
            });
        } else {
            tpgg.postStats({
                serverCount: client.guilds.cache.size,
                shardCount: client.options.shardCount
            });
        }
    }, 1800000);

}