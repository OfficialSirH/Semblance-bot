const { MessageEmbed } = require('discord.js'), {randomColor} = require('../../constants'),
    fetch = require('node-fetch');


module.exports = (client) => {
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
}