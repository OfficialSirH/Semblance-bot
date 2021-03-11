const { MessageEmbed } = require("discord.js"), {randomColor} = require('../../constants'), 
    { sirhGuildID } = require("../../config"), BOATS = require('boats.js'),
    Boats = new BOATS(JSON.parse(process.env.DBoatsAuth).Auth);

module.exports = (client) => {
    setInterval(function () {
        Boats.postStats(client.guilds.cache.size, client.user.id).then(() => {
            console.log('Successfully updated server count.');
        }).catch((err) => {
            console.error(err);
        });
    }, 1800000);
}