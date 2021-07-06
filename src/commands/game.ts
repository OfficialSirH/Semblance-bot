import { MessageEmbed, Collection, Permissions, Message, User, MessageActionRow, MessageButton, Snowflake } from 'discord.js'; 
import config from '@semblance/config';
import { randomColor } from '@semblance/constants';
import { Game, Information } from '@semblance/models';
import { Semblance } from '../structures';
import { GameFormat } from '../models/Game';
const { prefix } = config;
const cooldownHandler: Collection<string, number> = new Collection();

module.exports = {
    description: "An idle-game within Semblance",
    category: 'fun',
    usage: {
        "<help, create, collect, upgrade, leaderboard>": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0,
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    if (!cooldownHandler.get(message.author.id) && !message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) cooldownHandler.set(message.author.id, Date.now());
    else if (((Date.now() - cooldownHandler.get(message.author.id)) / 1000) < 5) {
        return message.reply(`You can't use the game command for another ${((Date.now() - cooldownHandler.get(message.author.id)) / 1000)} seconds.`);
    } else if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
        cooldownHandler.set(message.author.id, Date.now());
    }

    if (args.length >= 1) return message.reply(`**DEPRECATION NOTICE:**\nSemblance's Idle-Game has been updated to not require the use of 'collect', 'upgrade', and other arguments anymore.`
    + ` Semblance now uses a new feature in Discord called buttons that will make interactions with the bot more simplified. If you can't see the buttons you may need to update Discord.`
    + ` *tip: \`Stats\` button will go to the previous buttons so then you don't have to keep calling the command to collect and/or upgrade.*`);

    let statsHandler = await Game.findOne({ player: message.author.id }), embed = new MessageEmbed(), cost: number;
    if (!statsHandler) embed.setTitle(`Semblance's Idle-Game`)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription('Use the buttons below to play the game. :D');
    else embed.setTitle(`Welcome back to Semblance's Idle-Game!`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setThumbnail(message.author.displayAvatarURL())
        .addFields([
            { name: 'Level', value: statsHandler.level.toString() },
            { name: 'Random-Bucks', value: statsHandler.money.toFixed(3).toString() },
            { name: 'Percent Increase', value: statsHandler.percentIncrease.toString() },
            { name: 'Next Upgrade Cost', value: (await currentPrice(statsHandler)).toFixed(3).toString() },
            { name: 'Idle Profit', value: statsHandler.idleProfit.toFixed(3).toString() }
        ])
    .setFooter("Remember to vote for Semblance to gain a production boost!"), 
    cost = await currentPrice(statsHandler);
    
    const components = [new MessageActionRow()
        .addComponents(new MessageButton()
            .setCustomId(JSON.stringify({
                command: 'game',
                action: 'about',
                id: message.author.id
            }))
            .setStyle('PRIMARY')
            .setEmoji('❔')
            .setLabel('About'),
            new MessageButton()
            .setCustomId(JSON.stringify({
                command: 'game',
                action: 'collect',
                id: message.author.id
            }))
            .setDisabled(!Boolean(statsHandler))
            .setStyle('PRIMARY')
            .setEmoji('💵')
            .setLabel('Collect'),
            new MessageButton()
            .setCustomId(JSON.stringify({
                command: 'game',
                action: 'upgrade',
                id: message.author.id
            }))
            .setDisabled(!Boolean(statsHandler) || statsHandler.money < cost)
            .setStyle('PRIMARY')
            .setEmoji('⬆')
            .setLabel('Upgrade'),
            new MessageButton()
            .setCustomId(JSON.stringify({
                command: 'game',
                action: 'leaderboard',
                id: message.author.id
            }))
            .setStyle('PRIMARY')
            .setEmoji('🏅')
            .setLabel('Leaderboard'),
            new MessageButton()
            .setCustomId(JSON.stringify({
                command: 'game',
                action: 'vote',
                id: message.author.id
            }))
            .setStyle('PRIMARY')
            .setEmoji('💰')
            .setLabel('Voting Sites'))
    ];

    return message.channel.send({ embeds: [embed], components });

    if (args.length == 0) return message.reply(`Start with \`${prefix}game help\` to get more info on Semblance's idle game.`);
    let choice = args[0].toLowerCase();
    
    if (choice == 'help') return help(message);
    if (choice == 'leaderboard') return leaderboard(message);
    if (choice == 'stats') return gameStats(client, message, args);
    if (choice == 'create') return create(message);
    if (choice == 'collect' || choice == 'redeem') return collect(message);
    if (choice == 'upgrade') return upgrade(message, args[1]);
    if (choice == 'about') return about(message);
    if (choice == 'graphs') return graphs(message);
}

async function noGame(message: Message) {
    message.reply(`You have not created a game yet; if you'd like to create a game, use \`${prefix}game create\``);
}

async function graphs(message: Message) {
    let embed = new MessageEmbed()
        .setTitle("Graphed Data of Semblance's Idle Game")
        .setColor(randomColor)
        .setDescription("[Click Here for Game Data Graphs](https://charts.mongodb.com/charts-semblance-xnkqg/public/dashboards/5f9e8f7f-59c6-4a87-8563-0d68faed8515)");
    message.channel.send({ embeds: [embed] });
}

async function about(message: Message) {
    let embed = new MessageEmbed()
        .setTitle("What's Semblance's Idle-Game about?")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription("SIG, AKA Semblance's Idle-Game, is an RNG idle-game that uses a currency called Random-Bucks \n"+
                        `which yes, I asked Semblance whether or not I should use Random-Bucks as the name by using \`${prefix}8ball\`. `+
                       "If you're confused by the acronym RNG, it's an acronym for \"Random Number Generation/Generator\", which "+
                       "means that everything is kind of random and runs on random chance in the game. Everything that is random "+
                       "within this game is the cost multiplier per upgrade, starting profits, and the amount your profits increase.\n\n"+
                       "You have to collect Random-Bucks manually every once in a while, that is how the game works.")
        .setFooter("Noice");
    message.channel.send({ embeds: [embed] });
    
}

async function help(message: Message) {
    let embed = new MessageEmbed()
        .setTitle('Game Help')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(`You can create your own personal idle game by typing \`${prefix}game create\`, which the game will give a random range of price increase for upgrades from 25 - 50%, a starting profit ranging from 0.05 to 0.1, and a profit increase of 5-10% for every upgrade.\n\n` +
            `Typing \`${prefix}game about\` will provide more info on Semblance's Idle-Game.\n\n`+
            `Typing \`${prefix}game collect\` will collect your idle income.\n\n` +
            `Typing \`${prefix}game upgrade\` will upgrade your profit/sec by a random range of 5-10% if you've got enough Random-Bucks to purchase. If you'd like to buy the max upgrades, add \`max\`.\n\n` +
            `Typing \`${prefix}game leaderboard\` will rank the highest level users in the idle-game.\n\n` +
            `Typing \`${prefix}game stats\` will show your current stats in Semblance's idle-game.`)
        .setFooter("Have fun idling!");
    message.channel.send({ embeds: [embed] });
}

async function leaderboard(message: Message) {
    // const leaderboard = await Information.findOne({ infoType: 'gameleaderboard' });
    // let embed = new MessageEmbed()
    //     .setTitle("Semblance's idle-game leaderboard")
    //     .setAuthor(message.author.tag, message.author.displayAvatarURL())
    //     .setColor(randomColor)
    //     .setDescription(`${leaderboard.info}`)
    //     .setFooter("May the odds be with you.\n(Updates every minute)");
    // message.channel.send({ embeds: [embed] });
}

async function currentPrice(userData: GameFormat) {
        if (userData.level == userData.checkedLevel) {
            userData = await Game.findOneAndUpdate({ player: userData.player }, {
                $set: { checkedLevel: userData.checkedLevel+1, cost: userData.cost + userData.baseCost * Math.pow(userData.percentIncrease, userData.level + 1) }
            }, { new: true });
            return userData.cost;
        }
        return (userData.cost == 0) ? userData.baseCost : userData.cost;
}

async function create(message: Message) {
    let percent = ((Math.ceil(Math.random() * 25) + 25) / 100) + 1;
    let startingProfits = (Math.random() * 0.05) + 0.05;
    let existingData = await Game.findOne({ player: message.author.id });
    if (existingData) await Game.findOneAndDelete({ player: message.author.id });
    let creationHandler = new Game({ player: message.author.id, percentIncrease: percent, idleProfit: startingProfits, idleCollection: Date.now() });
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
    message.channel.send({ embeds: [embed] });
}

async function collect(message: Message) {
    let collectionHandler = await Game.findOne({ player: message.author.id });
    if (!collectionHandler) return noGame(message);
    let currentCollection = Date.now();
    let collected = collectionHandler.idleProfit * ((currentCollection - collectionHandler.idleCollection) / 1000);
    collectionHandler = await Game.findOneAndUpdate({ player: message.author.id }, { $set: { money: collectionHandler.money + collected, idleCollection: currentCollection } }, { new: true });
    let embed = new MessageEmbed()
        .setTitle("Balance")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(`You've collected ${collected} Random-Bucks and now your current balance is ${collectionHandler.money} Random-Bucks.`);
    message.channel.send({ embeds: [embed] });
}

async function upgrade(message: Message, max: string) {
    let upgradeHandler = await Game.findOne({ player: message.author.id });
    if (!upgradeHandler) return noGame(message);
    let previousLevel = upgradeHandler.level;
    let costSubtraction = await currentPrice(upgradeHandler);
    if (upgradeHandler.money < costSubtraction) 
        return message.channel.send({ embeds: [new MessageEmbed().setTitle("Not Enough Random-Bucks")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor(randomColor)
                .setDescription([`**Current Balance:** ${upgradeHandler.money} Random-Bucks`,
                                `**Upgrade Cost:** ${costSubtraction} Random-Bucks`,
                                `**How much more required:** ${costSubtraction - upgradeHandler.money} Random-Bucks`].join('\n'))] });
    if (max && max.toLowerCase() == 'max') {
        while (upgradeHandler.money > costSubtraction) {
            costSubtraction = await currentPrice(upgradeHandler);
            if (upgradeHandler.money > costSubtraction) upgradeHandler = await Game.findOneAndUpdate({ player: message.author.id }, { $set: { money: upgradeHandler.money - costSubtraction, level: upgradeHandler.level + 1, idleProfit: upgradeHandler.idleProfit * (Math.random() * 0.05 + 1.05) } }, { new: true });
        }
    } else {
        upgradeHandler = await Game.findOneAndUpdate({ player: message.author.id }, { $set: { money: upgradeHandler.money - costSubtraction, level: upgradeHandler.level + 1, idleProfit: upgradeHandler.idleProfit * (Math.random() * 0.05 + 1.05) } }, { new: true });
    }
    let embed = new MessageEmbed()
        .setTitle("Upgrade Stats")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(`You have successfully upgrade from level ${previousLevel} => ${upgradeHandler.level}.\n\nYour current balance is ${upgradeHandler.money} Random-Bucks.\n\nYour current profit is ${upgradeHandler.idleProfit} Random-Bucks/sec.`)
        .setFooter(`Upgrades will raise your rank in the '${prefix}game leaderboard', also, '${prefix}game upgrade max' will upgrade the max amount you're able to upgrade.`);
    message.channel.send({ embeds: [embed] });
}

async function gameStats(client: Semblance, message: Message, args: string[]) {
    let playerId: Snowflake = message.author.id;
    if (message.mentions.members.size > 0) playerId = message.mentions.members.first().id;
    else if (!!args[0].match(/\d{17,20}/g)) playerId = args[0].match(/\d{17,20}/g).join('') as Snowflake;
    let statsHandler = await Game.findOne({ player: playerId });
    if (!statsHandler) return noGame(message);
    let nxtUpgrade = await currentPrice(statsHandler);
    let player = await client.users.fetch(playerId);
    let embed = new MessageEmbed()
        .setTitle(`${message.author.username}'s gamestats`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setThumbnail(player.displayAvatarURL())
        .addFields(
            { name: 'Level', value: statsHandler.level.toString() },
            { name: 'Random-Bucks', value: statsHandler.money.toString() },
            { name: 'Percent Increase', value: statsHandler.percentIncrease.toString() },
            { name: 'Next Upgrade Cost', value: nxtUpgrade.toString() },
            { name: 'Idle Profit', value: statsHandler.idleProfit.toString() }
        )
        .setFooter("Remember to vote for Semblance to gain a production boost!");
    message.channel.send({ embeds: [embed] });
}
