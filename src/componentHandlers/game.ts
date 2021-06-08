import { ButtonData } from "@semblance/lib/interfaces/Semblance";
import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { Game, Information } from '@semblance/models';
import { filterAction, randomColor } from "../constants";
import config from '@semblance/config';
import { GameFormat } from "../models/Game";
const { prefix } = config;

export const run = async (interaction: MessageComponentInteraction, { action, id }: ButtonData) => {
    const game = await Game.findOne({ player: id });
    let cost: number;
    if (!!game) cost = await currentPrice(game);
    const components = [new MessageActionRow()
        .addComponents(new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'game',
                action: 'about',
                id
            }))
            .setStyle('PRIMARY')
            .setEmoji('❔')
            .setLabel('About'),
            new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'game',
                action: 'collect',
                id
            }))
            .setDisabled(!Boolean(game))
            .setStyle('PRIMARY')
            .setEmoji('💵')
            .setLabel('Collect'),
            new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'game',
                action: 'upgrade',
                id
            }))
            .setDisabled(!Boolean(game) || game.money < cost)
            .setStyle('PRIMARY')
            .setEmoji('⬆')
            .setLabel('Upgrade'),
            new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'game',
                action: 'leaderboard',
                id
            }))
            .setStyle('PRIMARY')
            .setEmoji('🏅')
            .setLabel('Leaderboard'),
            new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'game',
                action: 'stats',
                id
            }))
            .setDisabled(!Boolean(game))
            .setStyle('PRIMARY')
            .setEmoji('🔢')
            .setLabel('Stats')
        ), new MessageActionRow()
        .addComponents(new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'game',
                action: 'graph',
                id
            }))
            .setStyle('PRIMARY')
            .setEmoji('📈')
            .setLabel('Graph'),
            new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'game',
                action: 'create',
                id
            }))
            .setEmoji(Boolean(game) ?  '⛔' : '🌎')
            .setLabel(Boolean(game) ?  'Reset Progress' : 'Create new game')
            .setStyle(Boolean(game) ?  'DANGER' : 'SUCCESS'),
            new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'game',
                action: 'close',
                id
            }))
            .setEmoji('🚫')
            .setLabel('Close')
            .setStyle('SECONDARY')
    )];

    if (action != 'collect') filterAction(components, action);

    switch(action) {
        case 'create':
            Boolean(game) ? askConfirmation(interaction) : create(interaction, components);
            break;
        case 'reset':
            create(interaction, components);
        case 'about':
            about(interaction, components);
            break;
        case 'collect':
            collect(interaction, components);
            break;
        case 'upgrade':
            upgrade(interaction, components);
            break;
        case 'leaderboard':
            leaderboard(interaction, components);
            break;
        case 'stats':
            stats(interaction, components, game);
            break;
        case 'graph':
            graph(interaction, components);
            break;
        case 'close':
            interaction.message.delete();
    }
}

async function askConfirmation(interaction: MessageComponentInteraction) {
    const { user } = interaction;
    const components = [new MessageActionRow()
        .addComponents(new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'game',
                action: 'reset',
                id: user.id
            }))
            .setEmoji('🚫')
            .setLabel('Yes')
            .setStyle('DANGER'),
            new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'game',
                action: 'close',
                id: user.id
            }))
            .setLabel('No')
            .setStyle('SECONDARY')
    )];
    await interaction.update('Are you sure you want to reset your progress?', { embeds: [], components });
} 

async function create(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const { user } = interaction;
    let percent = ((Math.ceil(Math.random() * 25) + 25) / 100) + 1;
    let startingProfits = (Math.random() * 0.05) + 0.05;
    await Game.findOneAndDelete({ player: user.id });
    let creationHandler = new Game({ player: user.id, percentIncrease: percent, idleProfit: startingProfits, idleCollection: Date.now() });
    await creationHandler.save();
    let embed = new MessageEmbed()
        .setTitle('Game Created')
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(`Game Successfully created! Now you can start collecting Random-Bucks by typing \`${prefix}game collect\` and upgrade your Random-Bucks with \`${prefix}game upgrade\`\n\n`+
                       `Price Increase: ${(creationHandler.percentIncrease - 1)*100}%\n`+
                       `Starting Profits: ${creationHandler.idleProfit}/sec\n\n`+
                       `Reminder, don't be constantly spamming and creating a new game just cause your RNG stats aren't perfect \n`)
        .setFooter("Enjoy idling!");
    components = components.map(c => {
        c.components = c.components.map((b: MessageButton) => b.label == 'Collect' || b.label == 'Stats' ? b.setDisabled(false) : b);
        return c;
    });
    await interaction.update({ embeds: [embed], components });
}

async function about(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const { user } = interaction;
    let embed = new MessageEmbed()
        .setTitle("What's Semblance's Idle-Game about?")
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(randomColor)
        .setDescription("SIG, AKA Semblance's Idle-Game, is an RNG idle-game that uses a currency called Random-Bucks \n"+
                        "which yes, I asked Semblance whether or not I should use Random-Bucks as the name by using `s!8ball`. "+
                       "If you're confused by the acronym RNG, it's an acronym for \"Random Number Generation/Generator\", which "+
                       "means that everything is kind of random and runs on random chance in the game. Everything that is random "+
                       "within this game is the cost multiplier per upgrade, starting profits, and the amount your profits increase.\n\n"+
                       "You have to collect Random-Bucks manually every once in a while, that is how the game works.")
        .setFooter("Noice");
    await interaction.update({ embeds: [embed], components });
}

async function collect(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const { user } = interaction;
    let collectionHandler = await Game.findOne({ player: user.id });
    let currentCollection = Date.now();
    let collected = collectionHandler.idleProfit * ((currentCollection - collectionHandler.idleCollection) / 1000);
    collectionHandler = await Game.findOneAndUpdate({ player: user.id }, { $set: { money: collectionHandler.money + collected, idleCollection: currentCollection } }, { new: true });
    let embed = new MessageEmbed()
        .setTitle("Balance")
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(`You've collected ${collected} Random-Bucks and now your current balance is ${collectionHandler.money} Random-Bucks.`);
    await interaction.update({ embeds: [embed], components });
}

async function upgrade(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const { user } = interaction;
    let upgradeHandler = await Game.findOne({ player: user.id });
    let previousLevel = upgradeHandler.level;
    let costSubtraction = await currentPrice(upgradeHandler);

    while (upgradeHandler.money > costSubtraction) {
        costSubtraction = await currentPrice(upgradeHandler);
        if (upgradeHandler.money > costSubtraction) upgradeHandler = await Game.findOneAndUpdate({ player: user.id }, { $set: { money: upgradeHandler.money - costSubtraction, level: upgradeHandler.level + 1, idleProfit: upgradeHandler.idleProfit * (Math.random() * 0.05 + 1.05) } }, { new: true });
    }    

    let embed = new MessageEmbed()
        .setTitle("Upgrade Stats")
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(`You have successfully upgrade from level ${previousLevel} => ${upgradeHandler.level}.\n\nYour current balance is ${upgradeHandler.money} Random-Bucks.\n\nYour current profit is ${upgradeHandler.idleProfit} Random-Bucks/sec.`)
        .setFooter(`Upgrades will raise your rank in the '${prefix}game leaderboard', also, '${prefix}game upgrade max' will upgrade the max amount you're able to upgrade.`);
    await interaction.update({ embeds: [embed], components });
}

async function leaderboard(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const { user } = interaction;
    const leaderboard = await Information.findOne({ infoType: 'gameleaderboard' });
    let embed = new MessageEmbed()
        .setTitle("Semblance's idle-game leaderboard")
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(`${leaderboard.info}`)
        .setFooter("May the odds be with you.\n(Updates every minute)");
    await interaction.update({ embeds: [embed], components });
}

async function stats(interaction: MessageComponentInteraction, components: MessageActionRow[], game: GameFormat) {
    const { user } = interaction;
    let embed = new MessageEmbed()
    .setTitle(`Welcome back to Semblance's Idle-Game!`)
    .setAuthor(user.tag, user.displayAvatarURL())
    .setColor(randomColor)
    .setThumbnail(user.displayAvatarURL())
    .addFields(
        { name: 'Level', value: game.level },
        { name: 'Random-Bucks', value: game.money },
        { name: 'Percent Increase', value: game.percentIncrease },
        { name: 'Next Upgrade Cost', value: await currentPrice(game) },
        { name: 'Idle Profit', value: game.idleProfit }
    )
    .setFooter("Remember to vote for Semblance to gain a production boost!");
    await interaction.update({ embeds: [embed], components });
}

async function graph(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const { user } = interaction;
    let embed = new MessageEmbed()
        .setTitle("Graphed Data of Semblance's Idle Game")
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(randomColor)
        .setDescription("[Click Here for Game Data Graphs](https://charts.mongodb.com/charts-semblance-xnkqg/public/dashboards/5f9e8f7f-59c6-4a87-8563-0d68faed8515)");
    await interaction.update({ embeds: [embed], components });
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