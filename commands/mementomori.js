const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js'),
    { mementoMori } = require('../config.js');

module.exports = {
    description: "Memento Mori",
    usage: {
        "": ""
    },
    aliases: ['memento', 'unus', 'unusannus'],
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args, identifier) => {
    if (identifier == 'mementomori' || identifier == 'unusannus') return sendIt(message).then(() => message.delete({ timeout: 1000 }));
    if ((identifier == 'memento' && args[0] == 'mori') || (identifier == 'unus' && args[0] == 'mori')) return sendIt(message).then(() => message.delete({ timeout: 1000 }));
}

async function sendIt(message) {
    let embed = new MessageEmbed()
        .setTitle("Memento Mori")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor())
        .attachFiles(mementoMori)
        .setImage(mementoMori.name)
        .setDescription(`[The Goodbye](https://www.youtube.com/watch?v=aDQ3nfBbPWM)`);
    message.channel.send(embed);
    message.delete({ timeout: 1000 });
}