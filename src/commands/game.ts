import { MessageEmbed, Collection, Permissions, Message, User, MessageActionRow, MessageButton, Snowflake } from 'discord.js'; 
import config from '@semblance/config';
import { randomColor } from '@semblance/constants';
import { Game, Information } from '@semblance/models';
import { Semblance } from '../structures';
import { GameFormat } from '../models/Game';
import { currentPrice } from '../constants/commands';
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

    let statsHandler = await Game.findOne({ player: message.author.id }), embed = new MessageEmbed(), cost: number;
    if (!statsHandler) embed.setTitle(`Semblance's Idle-Game`)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(['Use the buttons below to play the game. :D',
        'If you can\'t see the buttons, you need to update your Discord.\n',
        'About - explains the game and its rules',
        'Collect - collect earnings',
        'Upgrade - upgrade profit',
        'Leaderboard - see top 20 players',
        'Vote - list of voting sites to earn bonus currency'].join('\n'));
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
}