const { Client, MessageEmbed } = require("discord.js");
var client = new Client();
//const discordBoatsAuth = require("./DiscordBoatAuth.json");
const BOATS = require('boats.js');
const Boats = new BOATS(JSON.parse(process.env.DBoatsAuth).Auth);

setInterval(function () {
    Boats.postStats(client.guilds.cache.size, client.user.id).then(() => {
        console.log('Successfully updated server count.');
    }).catch((err) => {
        console.error(err);
    });
}, 1800000);

/*const { Laffey, MemoryStorage } = require('laffey');

const app = new Laffey(process.env.PORT, '/webhook', {
    storage: new MemoryStorage(),
    auth: discordBoatsAuth.webAuth
});

app.on('vote', vote => {
    console.log(`${vote.username} has voted for ${bot.name}`);
    try {
        var embed = MessageEmbed()
            .setAuthor(vote.username)
            .setDescription("Thanks for voting for Semblance on Discord.boats!")
            .setFooter("Remember to vote on the websites found in s!vote :D");
        var channel = client.channels.cache.get("731772484285759600");
        channel.send(embed);
    } catch (err) {
        console.log(err);
    }
});
app.on('listen', () => console.log('Now listening!'));

app.listen();*/

module.exports = (mainClient) => {
    client = mainClient;
}