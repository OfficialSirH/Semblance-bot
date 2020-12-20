const { MessageEmbed } = require('discord.js'), { commandsCounter } = require('../bot.js'), randomColor = require('../constants/colorRandomizer.js'), { insertionSort } = require('../constants/index.js');

module.exports = {
    description: "Provides a list of every command and how many times they've been used from the start of Semblance's uptime",
    usage: {
        "": ""
    },
    aliases: ["cmdcount", "commandcount"],
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let description = "";
    let list = [];
    for (const [key, value] of Object.entries(commandsCounter)) {
        list.push([key, value]);
    }
    list = insertionSort(list);
    for (var counter of list) {
        description += `${counter[0]}: ${counter[1]}\n`;
    }
    let embed = new MessageEmbed()
        .setTitle("Command Counter")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor())
        .setDescription(description);
    message.channel.send(embed);
}