import config from '@semblance/config';
import { GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { rpsGames } from '../../applicationCommands/componentHandlers/rps';
import { randomColor } from '../constants';
import { countdownGIF, randomChoice } from '../constants/commands';
import { Semblance } from '../structures';
const { communistSemblance } = config;

module.exports = {
    description: "",
    category: 'fun',
    aliases: ['rpsls'],
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    if (args.length == 0) return message.reply('rps stands for "Rock, Paper, Scissors", which you can play with me by choosing one of the **Five** (Don\'t forget Lizard and Spock) and I\'ll choose one as well and we\'ll see who wins, there\'s also secret bonuses. :D');
    if (args[0] == 'multiplayer') return await rpsMultiplayer(message, args.slice(1, args.length).join(' '));

    let randomFailure = Math.ceil(Math.random() * 100);
    if (randomFailure == 100) return message.reply('***Error Ocurred... rebooting, try again in a moment.***');
    let sembRandomness = Math.ceil(Math.random() * 5), sembChoice = convertNumberToChoice(sembRandomness);
    let playerChoice = args[0].toLowerCase();
    if (playerChoice == 'senate') {
        let embed = new MessageEmbed()
            .setDescription('I *am* the senate, which means ***WE*** win this round!')
            .setImage(communistSemblance.name);
        return message.reply({ embeds: [embed], files: [communistSemblance] });
    }
    if (playerChoice == 'everything') return message.reply(`What the heck dude?! You don't need to use ***everything*** against ${sembChoice}!! You destroyed it after the *first* thing you threw at it, which was a nuclear bomb!!!`);
    if (playerChoice == 'logic') return message.reply(`With the power of ***logic***, you ask ${sembChoice} how much wood could a woodchuck chuck wood if a woodchuck could chuck wood, which then the ${sembChoice} vanishes from thinking too hard, ${message.author.username} wins!`);
    if (playerChoice == 'thanos') return message.reply(`Thanos wipes out half of ${sembChoice}, now the ${sembChoice} avengers will get revenge on Thanos in End Game.`);
    if (playerChoice == 'rps') return message.reply(`With the power of ***rock, paper, and scissors*** you **obliterate** ${sembChoice}, ${message.author.username} wins!`);
    if (playerChoice == 'sirh') return message.reply(`SirH deletes ${sembChoice}, ${message.author.username} wins!`);
    if (playerChoice == 'hype') return message.reply(`${sembChoice} gets disintegrated by the sight of Hype, ${message.author.username} wins!`);
    if (playerChoice == 'semblance' || playerChoice == 'nuke' || playerChoice == 'lunch' || playerChoice == 'computerlunch' || playerChoice == 'aditya' || playerChoice == 'tacocubes' || playerChoice == 'beyond' || playerChoice == 'trex' || playerChoice == 'devs' || playerChoice == 'singularity' || playerChoice == '0nrd' || playerChoice == '0nrd0r4' || playerChoice == 'Magneto' ) return message.reply(`'${playerChoice}' beats ${sembChoice}, ${message.author.username} wins!`);
    if (playerChoice == 'c2s' || playerChoice == 'celltosingularity') return message.reply(`The almight idle-game, Cell to Singularity, defeats ${sembChoice}. ${message.author.username} wins!`);
    if (playerChoice == 'dyno' || playerChoice == 'mee6') return message.reply(`'${playerChoice}' instantly loses against ${sembChoice}, ${message.author.username} didn't stand a chance with their choice.`);
    if (playerChoice == 'karen') return message.reply(`The ${playerChoice} loses against ${sembChoice} cause entitlement gets you no where in life.`);
    if (playerChoice == 'ban') return message.reply(`Ban wipes your existance, ${sembChoice} is now deleted and ${message.author.username} automatically loses 🔨!`);
    if (choiceToOutcome(playerChoice, sembChoice) === true) {
        return message.reply(`${playerChoice} beats ${sembChoice}, ${message.author.username} wins!`);
    } else if (choiceToOutcome(playerChoice, sembChoice) === false) {
        return message.reply(`${sembChoice} beats ${playerChoice}, ${client.user.username} wins!`);
    } else if (choiceToOutcome(playerChoice, sembChoice) == 'tie') {
        return message.reply(`We've both chosen ${playerChoice}, so it's a tie!`);
    }
    message.reply(`Due to your choice being invalid, I'mma just say that my choice, ${sembChoice}, beats whatever the heck ${playerChoice} is.`);
}

function convertNumberToChoice(number: number) {
    switch(number) {
        case 1:
            return 'rock';
            break;
        case 2:
            return 'paper';
            break;
        case 3:
            return 'scissors';
            break;
        case 4:
            return 'lizard';
            break;
        default:
            return 'spock';
    }
}

function choiceToOutcome(choice: string, sembChoice: string) {
    if (choice == 'rock') {
        if (sembChoice == 'paper') return false;
        if (sembChoice == 'scissors') return true;
        if (sembChoice == 'lizard') return true;
        if (sembChoice == 'spock') return false;
        if (sembChoice == 'rock') return 'tie';
    }
    if (choice == 'paper') {
        if (sembChoice == 'paper') return 'tie';
        if (sembChoice == 'scissors') return false;
        if (sembChoice == 'rock') return true;
        if (sembChoice == 'lizard') return false;
        if (sembChoice == 'spock') return true;
    }
    if (choice == 'scissors') {
        if (sembChoice == 'paper') return true;
        if (sembChoice == 'scissors') return 'tie';
        if (sembChoice == 'rock') return false;
        if (sembChoice == 'lizard') return true;
        if (sembChoice == 'spock') return false;
    }
    if (choice == 'lizard') {
        if (sembChoice == 'paper') return true;
        if (sembChoice == 'scissors') return false;
        if (sembChoice == 'rock') return false;
        if (sembChoice == 'lizard') return 'tie';
        if (sembChoice == 'spock') return true;
    }
    if (choice == 'spock') {
        if (sembChoice == 'paper') return false;
        if (sembChoice == 'scissors') return true;
        if (sembChoice == 'rock') return true;
        if (sembChoice == 'lizard') return false;
        if (sembChoice == 'spock') return 'tie';
    }
    return null;
}

async function rpsMultiplayer(message: Message, chosenOpponent: string) {
    const { client } = message;
    if (rpsGames.has(message.author.id)) return message.reply('You have an RPS game still running, please finish your previous game first');
    let opponent: GuildMember;
    try {
        if (chosenOpponent.length == 0) opponent = await message.guild.members.fetch(client.user.id);
        else opponent = (await message.guild.members.fetch({ query: chosenOpponent })).first();
    } catch(err) {
        return message.reply('The chosen user does not exist.');
    } finally {
        if (opponent.id == message.author.id) return message.reply("Are you this lonely that you chose to face yourself? I'm sorry, but that's not how this game works.");
        if (opponent.user.bot && opponent.user.id != client.user.id) return message.reply(`You can't face a bot (except for me) so what are you doing trying to fight, ${opponent.user.tag}?`);
        const components = [new MessageActionRow()
        .addComponents([new MessageButton()
            .setLabel('Rock')
            .setCustomId(JSON.stringify({
                command: 'rps',
                action: 'rock',
                id: message.author.id
            }))
            .setEmoji('🪨')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setLabel('Paper')
            .setCustomId(JSON.stringify({
                command: 'rps',
                action: 'paper',
                id: message.author.id
            }))
            .setEmoji('📄')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setLabel('Scissors')
            .setCustomId(JSON.stringify({
                command: 'rps',
                action: 'scissors',
                id: message.author.id
            }))
            .setEmoji('✂')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setLabel('Lizard')
            .setCustomId(JSON.stringify({
                command: 'rps',
                action: 'lizard',
                id: message.author.id
            }))
            .setEmoji('🦎')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setLabel('Spock')
            .setCustomId(JSON.stringify({
                command: 'rps',
                action: 'spock',
                id: message.author.id
            }))
            .setEmoji('👽')
            .setStyle('SECONDARY')
        ])],
        awaitingText = `Awaiting for **${message.author.tag}** and **${opponent.user.tag}**`,
        semblanceChoice = randomChoice(),
        embed = new MessageEmbed()
        .setTitle(`${message.author.tag} has challenged ${opponent.user.tag} to Rock, Paper, Scissors, Lizard, Spock!`)
        .setThumbnail(countdownGIF)
        .setColor(randomColor)
        .setDescription('Make your choice with one of the buttons below.');

        let rpsMessage: Message;
        if (opponent.id == client.user.id) rpsMessage = await message.reply({ content: `Awaiting for **${message.author.tag}**`, embeds: [embed], components });
        else rpsMessage = await message.reply({ content: awaitingText, embeds: [embed], components });

        rpsGames.set(message.author.id, {
            player: {
                id: message.author.id,
                tag: message.author.tag
            },
            opponent: {
                id: opponent.id,
                tag: opponent.user.tag,
                choice: (opponent.id == client.user.id) ? semblanceChoice : ''
            },
            timeout: setTimeout(async () => {
                if (rpsGames.has(message.author.id)) await rpsMessage.edit({ content: null, 
                    embeds: [rpsMessage.embeds[0].setTitle('RPS game has timed out').setDescription('Someone took too long to make a choice. :(')],
                    components: []
                });
                rpsGames.delete(message.author.id)
            }, 60000)
        });
    }
}