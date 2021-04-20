const { MessageEmbed, Collection, Permissions } = require('discord.js'), { prefix } = require('../config.js').default,
    { insertionSort, randomColor } = require('../constants'),
    GameModel = require('../models/Game.js').Game,
    cooldownHandler = new Collection(),
    { Information } = require('./edit.js');

let leaderboardList = 'There is currently no one who has upgraded their income or the leaderboard hasn\'t updated.';

module.exports = {
    description: "An idle-game within Semblance",
    category: 'fun',
    usage: {
        "<help, create, collect, upgrade, leaderboard>": ""
    },
    permissionRequired: 0,
    checkArgs: args => args.length >= 0,
    GameModel: GameModel,
    updateLeaderboard: (client) => updateLeaderboard(client),
    leaderboardList: leaderboardList
}

module.exports.run = async (client, message, args) => {
    if (!cooldownHandler.get(message.author.id) && !message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) cooldownHandler.set(message.author.id, Date.now());
    else if (((Date.now() - cooldownHandler.get(message.author.id)) / 1000) < 5) {
        return message.reply(`You can't use the game command for another ${((Date.now() - cooldownHandler.get(message.author.id)) / 1000)} seconds.`);
    } else if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
        cooldownHandler.set(message.author.id, Date.now());
    }
    if (args.length == 0) return message.reply(`Start with \`${prefix}game help\` to get more info on Semblance's idle game.`);
    let choice = args[0].toLowerCase();
    if (choice == 'help') return help(client, message);
    if (choice == 'leaderboard') return leaderboard(client, message);
    if (choice == 'stats') return gameStats(client, message, args);
    if (choice == 'create') return create(client, message);
    if (choice == 'collect' || choice == 'redeem') return collect(client, message);
    if (choice == 'upgrade') return upgrade(client, message, args[1]);
    if (choice == 'about') return about(client, message);
    if (choice == 'graphs') return graphs(client, message);
}

async function noGame(message) {
    message.reply("You have not created a game yet; if you'd like to create a game, use `s!game create`");
}

async function graphs(client, message) {
    let embed = new MessageEmbed()
        .setTitle("Graphed Data of Semblance's Idle Game")
        .setColor(randomColor)
        .setDescription("[Click Here for Game Data Graphs](https://charts.mongodb.com/charts-semblance-xnkqg/public/dashboards/5f9e8f7f-59c6-4a87-8563-0d68faed8515)");
    message.channel.send(embed);
}

async function about(client, message) {
    let embed = new MessageEmbed()
        .setTitle("What's Semblance's Idle-Game about?")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription("SIG, AKA Semblance's Idle-Game, is an RNG idle-game that uses a currency called Random-Bucks \n"+
                        "which yes, I asked Semblance whether or not I should use Random-Bucks as the name by using `s!8ball`. "+
                       "If you're confused by the acronym RNG, it's an acronym for \"Random Number Generation/Generator\", which "+
                       "means that everything is kind of random and runs on random chance in the game. Everything that is random "+
                       "within this game is the cost multiplier per upgrade, starting profits, and the amount your profits increase.\n\n"+
                       "You have to collect Random-Bucks manually every once in a while, that is how the game works.")
        .setFooter("Noice");
    message.channel.send(embed);
    
}

async function help(client, message) {
    let embed = new MessageEmbed()
        .setTitle('game help')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(`You can create your own personal idle game by typing \`${prefix}game create\`, which the game will give a random range of price increase for upgrades from 25 - 50%, a starting profit ranging from 0.05 to 0.1, and a profit increase of 5-10% for every upgrade.\n\n` +
            `Typing \`${prefix}game about\` will provide more info on Semblance's Idle-Game.\n\n`+
            `Typing \`${prefix}game collect\` will collect your idle income.\n\n` +
            `Typing \`${prefix}game upgrade\` will upgrade your profit/sec by a random range of 5-10% if you've got enough Random-Bucks to purchase. If you'd like to buy the max upgrades, add \`max\`.\n\n` +
            `Typing \`${prefix}game leaderboard\` will rank the highest level users in the idle-game.\n\n` +
            `Typing \`${prefix}game stats\` will show your current stats in Semblance's idle-game.`)
        .setFooter("Have fun idling!");
    message.channel.send(embed);
}

async function updateLeaderboard(client) {
    let users = {}, mappedUsers = await GameModel.find({}), cacheList = await Information.findOne({ infoType: 'cacheList' });
    await mappedUsers.forEach(async (user, ind) => users[user.player] = user.level);
    let list = [];
    for (const [key, value] of Object.entries(users)) {
        let user = (!!client.users.cache.get(key)) ? client.users.cache.get(key) : null;
        if (!user) {
            let newList = [...cacheList.list, key];
            await Information.findOneAndUpdate({ infoType: 'cacheList' }, { $set: { list: newList } }, { new: true });
            user = await client.users.fetch(key);
        }
        list.push([user.tag, value]);
    }
    list = insertionSort(list).filter((item, ind) => ind < 20).reduce((total, cur, ind) => total += `${ind + 1}. ${cur[0]} - level ${cur[1]}\n`, '');
    if (!list) leaderboardList = 'There is currently no one who has upgraded their income.';
    else leaderboardList = list;
    module.exports.leaderboardList = leaderboardList;
    setTimeout(() => module.exports.updateLeaderboard(client), 50000);
}

async function leaderboard(client, message) {
        
    let embed = new MessageEmbed()
        .setTitle("Semblance's idle-game leaderboard")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(`${leaderboardList}`)
        .setFooter("May the odds be with you.\n(Updates every minute)");
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
    let percent = ((Math.ceil(Math.random() * 25) + 25) / 100) + 1;
    let startingProfits = (Math.random() * 0.05) + 0.05;
    let existingData = await GameModel.findOne({ player: message.author.id });
    if (existingData) await GameModel.findOneAndDelete({ player: message.author.id });
    let creationHandler = new GameModel({ player: message.author.id, percentIncrease: percent, idleProfit: startingProfits, idleCollection: Date.now() });
    await creationHandler.save();
    let embed = new MessageEmbed()
        .setTitle('Game Created')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(`Game Successfully created! Now you can start collecting Random-Bucks by typing \`${prefix}game collect\` and upgrade your Random-Bucks with \`${prefix}game upgrade\`\n\n`+
                       `Price Increase: ${(creationHandler.percentIncrease - 1)*100}%\n`+
                       `Starting Profits: ${creationHandler.idleProfit}/sec\n\n`+
                       `Reminder, don't be constantly spamming and creating a new game just cause your RNG stats aren't perfect \n`)
        .setFooter("Enjoy idling!");
    message.channel.send(embed);
}

async function collect(client, message) {
    let collectionHandler = await GameModel.findOne({ player: message.author.id });
    if (!collectionHandler) return noGame(message);
    let currentCollection = Date.now();
    let collected = collectionHandler.idleProfit * ((currentCollection - collectionHandler.idleCollection) / 1000);
    collectionHandler = await GameModel.findOneAndUpdate({ player: message.author.id }, { $set: { money: collectionHandler.money + collected, idleCollection: currentCollection } }, { new: true });
    let embed = new MessageEmbed()
        .setTitle("Balance")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(`You've collected ${collected} Random-Bucks and now your current balance is ${collectionHandler.money} Random-Bucks.`);
    message.channel.send(embed);
}

async function upgrade(client, message, max) {
    let upgradeHandler = await GameModel.findOne({ player: message.author.id });
    if (!upgradeHandler) return noGame(message);
    let previousLevel = upgradeHandler.level;
    let costSubtraction = await currentPrice(message.author.id, upgradeHandler);
    if (upgradeHandler.money < costSubtraction) 
        return message.channel.send(new MessageEmbed().setTitle("Not Enough Random-Bucks")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor(randomColor)
                .setDescription([`**Current Balance:** ${upgradeHandler.money} Random-Bucks`,
                                `**Upgrade Cost:** ${costSubtraction} Random-Bucks`,
                                `**How much more required:** ${costSubtraction - upgradeHandler.money} Random-Bucks`].join('\n')));
    if (max && max.toLowerCase() == 'max') {
        while (upgradeHandler.money > costSubtraction) {
            costSubtraction = await currentPrice(message.author.id, upgradeHandler);
            if (upgradeHandler.money > costSubtraction) upgradeHandler = await GameModel.findOneAndUpdate({ player: message.author.id }, { $set: { money: upgradeHandler.money - costSubtraction, level: upgradeHandler.level + 1, idleProfit: upgradeHandler.idleProfit * (Math.random() * 0.05 + 1.05) } }, { new: true });
        }
    } else {
        upgradeHandler = await GameModel.findOneAndUpdate({ player: message.author.id }, { $set: { money: upgradeHandler.money - costSubtraction, level: upgradeHandler.level + 1, idleProfit: upgradeHandler.idleProfit * (Math.random() * 0.05 + 1.05) } }, { new: true });
    }
    let embed = new MessageEmbed()
        .setTitle("Upgrade Stats")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(`You have successfully upgrade from level ${previousLevel} => ${upgradeHandler.level}.\n\nYour current balance is ${upgradeHandler.money} Random-Bucks.\n\nYour current profit is ${upgradeHandler.idleProfit} Random-Bucks/sec.`)
        .setFooter(`Upgrades will raise your rank in the \`${prefix}game leaderboard\`, also, \`${prefix}game upgrade max\` will upgrade the max amount you're able to upgrade.`);
    message.channel.send(embed);
}

async function gameStats(client, message, args) {
    let player = message.author.id;
    if (message.mentions.members.size > 0) player = message.mentions.members[0].id;
    else if (args[0].match(/\d/g) != null && args[0].match(/\d/g).join('').length == 18) player = args[0].match(/\d/g).join('');
    /*let player = (message.mentions.members) ? message.mentions.members[0] : 
                (args[0].match(/\d/g) != null && args[0].match(/\d/g).join('').length == 18) ? args[0].match(/\d/g).join('') : 
                    message.author.id;*/
    let statsHandler = await GameModel.findOne({ player: player });
    if (!statsHandler) return noGame(message);
    let nxtUpgrade = await currentPrice(player, statsHandler);
    player = await client.users.fetch(player);
    let embed = new MessageEmbed()
        .setTitle(`${message.author.username}'s gamestats`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
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
