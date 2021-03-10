const { MessageEmbed, MessageAttachment } = require('discord.js'),
    { archieDance } = require('../config.js');

module.exports = {
    description: "View epic videos of Archie dancing.",
    category: 'fun',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let embed = new MessageEmbed()
        .setTitle("Dancing Archie/Jotaru")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription("Here's the epic 3 minute video with Archie and Jotaru dancing, which I made as suggested by McScrungledorf#6020.")
        .setURL("https://drive.google.com/file/d/1twLIqvEG-wwZJFmhtSERWBM5KoJ3zmkg/view?usp=sharing");
    await message.channel.send(embed);
    message.channel.send(`here's dancing Archie :D`, archieDance);
}