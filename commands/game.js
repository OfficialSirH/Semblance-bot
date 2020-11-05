const { MessageEmbed, Collection } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js'), { prefix } = require('../config.js'),
    GameModel = require('../models/Game.js');
var cooldownHandler = new Collection();
module.exports = {
    description: "An idle-game within Semblance",
    usage: {
        "<help, create, collect, upgrade, leaderboard>": ""
    },
    permissionRequired: 0,
    checkArgs: args => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    if (!cooldownHandler.get(message.author.id) && !message.member.hasPermission("MANAGE_MESSAGES")) cooldownHandler.set(message.author.id, new Date());
    else if (((new Date() - cooldownHandler.get(message.author.id)) / 1000) < 5) {
        return message.reply("You're on cooldown with this command.");
    } else if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        cooldownHandler.set(message.author.id, new Date());
    }
    if (args.length == 0) return message.reply(`Start with \`${prefix}game help\` to get more info on Semblance's idle game.`);
    var choice = args[0].toLowerCase();
    if (choice == 'help') return help(client, message);
    if (choice == 'leaderboard') return leaderboard(client, message);
    if (choice == 'stats') return gameStats(client, message);
    if (choice == 'create') return create(client, message);
    if (choice == 'collect') return collect(client, message);
    if (choice == 'upgrade') return upgrade(client, message, args[1]);
    if (choice == 'about') return about(client, message);
    if (choice == 'graphs') return graphs(client, message);
}

async function noGame(message) {
    message.reply("You have not created a game yet; if you'd like to create a game, use `s!game create`");
}

async function graphs(client, message) {
    var embed = new MessageEmbed()
        .setTitle("Graphed Data of Semblance's Idle Game")
        .setColor(randomColor())
        .setDescription("[Click Here for Game Data Graphs](https://charts.mongodb.com/charts-semblance-xnkqg/public/dashboards/5f9e8f7f-59c6-4a87-8563-0d68faed8515)");
    message.channel.send(embed);
}

async function about(client, message) {
    var embed = new MessageEmbed()
        .setTitle("What's Semblance's Idle-Game about?")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor())
        .setDescription("SIG, AKA Semblance's Idle-Game, is an RNG idle-game that uses a currency called Random-Bucks \n"+
                        "which yes, I asked Semblance whether or not I should use Random-Bucks as the name by using `s!8ball`. "+
                       "If you're confused by the acronym RNG, it's an acronym for \"Random Number Generation/Generator\", which "+
                       "means that everything is kind of random and runs on random chance in the game. Everything that is random "+
                       "within this game is the cost multiplier per upgrade, starting profits, and the amount your profits increase.\n\n"+
                       "If you'd like to suggest ideas for the idle-game, just ping me, but please stop asking for automatic collection "+
                       "just so then you don't have to collect it manually, cause that isn't how the game works.")
        .setFooter("Noice");
    message.channel.send(embed);
    
}

async function help(client, message) {
    var embed = new MessageEmbed()
        .setTitle('game help')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor())
        .setDescription(`You can create your own personal idle game by typing \`${prefix}game create\`, which the game will give a random range of price increase for upgrades from 25 - 50%, a starting profit ranging from 0.05 to 0.1, and a profit increase of 5-10% for every upgrade.\n\n` +
            `Typing \`${prefix}game about\` will provide more info on Semblance's Idle-Game.\n\n`+
            `Typing \`${prefix}game collect\` will collect your idle income.\n\n` +
            `Typing \`${prefix}game upgrade\` will upgrade your profit/sec by a random range of 5-10% if you've got enough Random-Bucks to purchase. If you'd like to buy the max upgrades, add \`max\`.\n\n` +
            `Typing \`${prefix}game leaderboard\` will rank the highest level users in the idle-game.\n\n` +
            `Typing \`${prefix}game stats\` will show your current stats in Semblance's idle-game.`)
        .setFooter("Have fun idling!");
    message.channel.send(embed);
}

async function leaderboard(client, message) {
        var users = {};
        var mappedUsers = await GameModel.find({});
        await mappedUsers.forEach(async (user, ind) => users[user.player] = user.level);
        var list = [];
        for (const [key, value] of Object.entries(users)) {
            var user = await client.users.fetch(key);
            list.push([user.tag, value]);
    }
    list = list.sort((a, b) => b[1] - a[1]).filter((item, ind) => ind < 20).reduce((total, cur, ind) => total += `${ind + 1}. ${cur[0]} - level ${cur[1]}\n`, '');
    if (!list) list = 'There is currently no one who has upgraded their income';
    var embed = new MessageEmbed()
        .setTitle("Semblance's idle-game leaderboard")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor())
        .setDescription(`${list}`)
        .setFooter("May the odds be with you.");
    message.channel.send(embed);
}

async function currentPrice(userID, userData) {
        if (userData.level == userData.checkedLevel) {
            userData = await GameModel.findOneAndUpdate({ player: userID }, {
                $set: { checkedLevel: userData.checkedLevel+1, cost: userData.cost + userData.baseCost * Math.pow(userData.percentIncrease, userData.level + 1) }
            }, { new: true });
            return userData.cost;
        }
        return (userData.cost == 0) ? userData.baseCost : userData.cost;
}

async function create(client, message) {
    var percent = ((Math.ceil(Math.random() * 25) + 25) / 100) + 1;
    var startingProfits = (Math.random() * 0.05) + 0.05;
    var existingData = GameModel.findOne({ player: message.author.id });
    if (existingData) await GameModel.findOneAndDelete({ player: message.author.id });
    var creationHandler = new GameModel({ player: message.author.id, percentIncrease: percent, idleProfit: startingProfits, idleCollection: Date.now() });
    await creationHandler.save();
    var embed = new MessageEmbed()
        .setTitle('Game Created')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor())
        .setDescription(`Game Successfully created! Now you can start collecting Random-Bucks by typing \`${prefix}game collect\` and upgrade your Random-Bucks with \`${prefix}game upgrade\`\n\n`+
                       `Price Increase: ${(creationHandler.percentIncrease - 1)*100}%\n`+
                       `Starting Profits: ${creationHandler.idleProfit}/sec\n\n`+
                       `Reminder, don't be constantly creating a new game just cause your RNG stats are bad, cause \n`+
                       `1. That's pretty much spamming if you're going to be doing that a lot and\n`+
                       `2. I might decide to troll you with my eval command if you keep creating a new game.`)
        .setFooter("Enjoy idling!");
    message.channel.send(embed);
}

async function collect(client, message) {
    var collectionHandler = await GameModel.findOne({ player: message.author.id });
    if (!collectionHandler) return noGame(message);
    var currentCollection = Date.now();
    var collected = collectionHandler.idleProfit * ((currentCollection - collectionHandler.idleCollection) / 1000);
    collectionHandler = await GameModel.findOneAndUpdate({ player: message.author.id }, { $set: { money: collectionHandler.money + collected, idleCollection: currentCollection } }, { new: true });
    var embed = new MessageEmbed()
        .setTitle("Balance")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor())
        .setDescription(`You've collected ${collected} Random-Bucks and now your current balance is ${collectionHandler.money} Random-Bucks.`);
    message.channel.send(embed);
}

async function upgrade(client, message, max) {
    var upgradeHandler = await GameModel.findOne({ player: message.author.id });
    if (!upgradeHandler) return noGame(message);
    var previousLevel = upgradeHandler.level;
    var costSubtraction = await currentPrice(message.author.id, upgradeHandler);
    if (upgradeHandler.money < costSubtraction) return message.reply(`You don't have enough Random-Bucks for this upgrade, your current balance is ${upgradeHandler.money} Random-Bucks and the next upgrade requires ${costSubtraction} Random-Bucks.`);
    if (max && max.toLowerCase() == 'max') {
        while (upgradeHandler.money > costSubtraction) {
            costSubtraction = await currentPrice(message.author.id, upgradeHandler);
            if (upgradeHandler.money > costSubtraction) upgradeHandler = await GameModel.findOneAndUpdate({ player: message.author.id }, { $set: { money: upgradeHandler.money - costSubtraction, level: upgradeHandler.level + 1, idleProfit: upgradeHandler.idleProfit * (Math.random() * 0.05 + 1.05) } }, { new: true });
        }
    } else {
        upgradeHandler = await GameModel.findOneAndUpdate({ player: message.author.id }, { $set: { money: upgradeHandler.money - costSubtraction, level: upgradeHandler.level + 1, idleProfit: upgradeHandler.idleProfit * (Math.random() * 0.05 + 1.05) } }, { new: true });
    }
    var embed = new MessageEmbed()
        .setTitle("Upgrade Stats")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor())
        .setDescription(`You have successfully upgrade from level ${previousLevel} => ${upgradeHandler.level}.\n\nYour current balance is ${upgradeHandler.money} Random-Bucks.\n\nYour current profit is ${upgradeHandler.idleProfit} Random-Bucks/sec.`)
        .setFooter(`Upgrades will raise your rank in the \`${prefix}game leaderboard\``);
    message.channel.send(embed);
}

async function gameStats(client, message) {
    var statsHandler = await GameModel.findOne({ player: message.author.id });
    if (!statsHandler) return noGame(message);
    var nxtUpgrade = await currentPrice(message.author.id, statsHandler);
    var embed = new MessageEmbed()
        .setTitle(`${message.author.username}'s gamestats`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor())
        .setThumbnail(message.author.displayAvatarURL())
        .addFields(
            { name: 'Level', value: statsHandler.level },
            { name: 'Random-Bucks', value: statsHandler.money },
            { name: 'Percent Increase', value: statsHandler.percentIncrease },
            { name: 'Next Upgrade Cost', value: nxtUpgrade },
            { name: 'Idle Profit', value: statsHandler.idleProfit }
        )
        .setFooter("Remember to vote for Semblance to gain a production boost!");
    message.channel.send(embed);
}
