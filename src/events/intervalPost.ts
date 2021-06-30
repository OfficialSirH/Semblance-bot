import fetch from 'node-fetch';
import { BFDApi, DBLApi, Semblance } from '@semblance/structures';
import * as TopggSDK from '@top-gg/sdk';

export const intervalPost = (client: Semblance) => {
    const dBotsBaseURL = 'https://discord.bots.gg/api/v1';
    setInterval(async function() {
        const data = { guildCount: client.guilds.cache.size };
        const r = await (await fetch(dBotsBaseURL + '/bots/' + client.user.id + '/stats', {
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
    
    
    const discordListBaseURL = 'https://api.discordlist.space';
    client.setInterval(() => {
        const data = { server_count: client.guilds.cache.size };
        fetch(discordListBaseURL + '/bots/' + client.user.id, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(process.env.botListSpaceAuth).Auth
            },
            body: JSON.stringify(data)
        })
        .then(d=>d.json())
        .then(()=>console.log("Server count post to discordlist.space was successful"))
        .catch(console.error)
    }, 1800000);
    
    
    const boatsBaseURL = 'https://discord.boats/api';
    client.setInterval(function () {
        fetch(boatsBaseURL + '/bot/' + client.user.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: JSON.parse(process.env.DBoatsAuth).Auth
            },
            body: JSON.stringify({ server_count: client.guilds.cache.size })
        })
        .then(d => d.json())
        .then(()=>console.log('Server count post to discord.boats was successful'))
        .catch(console.error)
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