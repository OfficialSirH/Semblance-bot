const { MessageEmbed } = require('discord.js'), CommandCounter = require('../models/CommandCounter.js'), randomColor = require('../constants/colorRandomizer.js'),
    { GameModel, leaderboardList } = require('./game.js'), { insertionSort } = require('../constants/index.js');

module.exports = {
    description: "Provides stats on yourself or any user you specify",
    usage: {
        "": ""
    },
    aliases: ['userstat'],
    checkArgs: (args) => args.length >= 0,
    CommandCounter: CommandCounter,
    updateCommandCounter: async (client, message) => {
        let commandCounter = await CommandCounter.findOne({ userID: message.author.id });
        if (commandCounter) await CommandCounter.findOneAndUpdate({ userID: message.author.id }, { $set: { commands: ++commandCounter.commands[command] } }, { new: true });
        else {
            let setupCommands = {};
            setupCommands[command] = 1;
            commandCounter = new CommandCounter({ userID: message.author.id, commands: setupCommands });
        }
    }
}

module.exports.run = async (client, message, args) => {
    return message.reply("Broken as heck at the moment.");
    let user = (args[0]) ? (args[0].match(/\d/g)) ? args[0].match(/\d/g).join('') : null : message.author;
    if (!user) user = message.author;
    else if (user != message.author) try { user = await client.users.fetch(user); } catch(e) { }
    if (!user) message.author;

    let userGameData = await GameModel.findOne({ player: user.id }),
        userCmdCounterData = await CommandCounter.findOne({ userID: user.id }),
        description = "";

    if (userGameData) {
        let leaderboardPosition = (leaderboardList.substring(0, leaderboardList.indexOf(user.username)).match(/\n/g) || []).length+1;
        leaderboardPosition = (leaderboardPosition == 0) ? `20+` : leaderboardPosition;
        description += [`Game Level - ${userGameData.level}`,
        `User Money - ${userGameData.money}`,
        `Game Leaderboard Position - ${leaderboardPosition}`].join('\n');
    }
    if (userCmdCounterData) {
        let commandsList = [];
        for (const [key, value] of Object.entries(userCmdCounterData.commands)) commandsList.push([key, value]);
        commandsList = insertionSort(commandsList);
        description += `\nMost used command: ${commandsList[0][0]}\nTop 5 commands:\n`;
        for (var i = 0; i < (commandsList.length <= 5) ? commandsList.length : 5; i++) description += `${i + 1}. ${commandsList[i][0]} - ${commandsList[i][1]}\n`;
        description += `Total commands used: ${commandsList.reduce((total, cur, ind) => total += cur[1], 0)}`;
        
    }

    let embed = new MessageEmbed()
        .setTitle(`${user.username}'s User Stats`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setThumbnail(message.author.displayAvatarURL())
        .setColor(randomColor())
        .setDescription(description)
        .setTimestamp(Date.now())
        .setFooter("ಠ_ಠ");
    message.channel.send(embed);
}