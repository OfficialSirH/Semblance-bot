const { MessageEmbed } = require('discord.js'), {randomColor} = require('../../constants'),
    fetch= require('node-fetch');
/* /discordblwebhook */
module.exports = (client) => {
    const baseURL = 'https://discordbotlist.com/api/v1';

    setInterval(() => {
        const data = { guilds: client.guilds.cache.size };
        const r = await (await fetch(baseURL + '/bots/' + client.user.id + '/stats', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(process.env.botsForDiscordAuth).Auth
            },
            body: JSON.stringify(data)
        })).json();
        console.log(`discordbotlist.com Stat Post Succeeded: ${r.success}`);
    }, 1800000);

    // MAYBE TODO: Create webhook server for receiving votes
}