const { MessageEmbed } = require('discord.js'), {randomColor} = require('../../constants'),
    fetch = require('node-fetch');

module.exports = (client) => {
    const baseURL = 'https://botsfordiscord.com/api';

    setInterval(() => {
        const data = { server_count: client.guilds.cache.size };
        const r = await (await fetch(baseURL + '/bot/' + client.user.id, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(process.env.botsForDiscordAuth).Auth
            },
            body: JSON.stringify(data)
        })).json();
        console.log(`botsfordiscord.com: ${r.message}`);
    }, 1800000);

    // MAYBE TODO: figure out how to implement a webhook server for receiving votes
}