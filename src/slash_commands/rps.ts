import config from '@semblance/config';
import { MessageEmbed, Util, CommandInteraction } from 'discord.js';
import { Semblance } from '../structures';
const { communistSemblance } = config; 
const c2sList = ['semblance', 'nuke', 'lunch', 'computerlunch', 'aditya', 'tacocubes', 'beyond', 
                'trex', 'devs', 'singularity', '0nrd', '0nrd0r4', 'magneto'];

module.exports.permissionRequired = 0;

module.exports.run = async (client: Semblance, interaction: CommandInteraction) => {
    let choice = interaction.options[0].value as string,
        user = interaction.member.user;
    if (choice.length == 0) return interaction.reply('rps stands for "Rock, Paper, Scissors", which you can play with me by choosing one of the **Five** (Don\'t forget Lizard and Spock) and I\'ll choose one as well and we\'ll see who wins, there\'s also secret bonuses. :D');
    choice = Util.removeMentions(choice);
    let randomFailure = Math.ceil(Math.random() * 100);
    if (randomFailure == 100) return interaction.reply('***Error Ocurred... rebooting, try again in a moment.***');
    let sembRandomness = Math.ceil(Math.random() * 5), sembChoice = convertNumberToChoice(sembRandomness);
    let playerChoice = choice.toLowerCase();
    if (playerChoice == 'senate') {
        let embed = new MessageEmbed()
            .setDescription('I *am* the senate, which means ***WE*** win this round!')
            .attachFiles([communistSemblance])
            .setImage(communistSemblance.name);
        return interaction.reply(embed);
    }
    if (playerChoice == 'everything') return interaction.reply(`What the heck dude?! You don't need to use ***everything*** against ${sembChoice}!! You destroyed it after the *first* thing you threw at it, which was a nuclear bomb!!!`);
    if (playerChoice == 'logic') return interaction.reply(`With the power of ***logic***, you ask ${sembChoice} how much wood could a woodchuck chuck wood if a woodchuck could chuck wood, which then the ${sembChoice} vanishes from thinking too hard, ${user.username} wins!`);
    if (playerChoice == 'thanos') return interaction.reply(`Thanos wipes out half of ${sembChoice}, now the ${sembChoice} avengers will get revenge on Thanos in End Game.`);
    if (playerChoice == 'rps') return interaction.reply(`With the power of ***rock, paper, and scissors*** you **obliterate** ${sembChoice}, ${user.username} wins!`);
    if (playerChoice == 'sirh') return interaction.reply(`SirH deletes ${sembChoice}, ${user.username} wins!`);
    if (playerChoice == 'hype') return interaction.reply(`${sembChoice} gets disintegrated by the sight of Hype, ${user.username} wins!`);

    if (c2sList.includes(playerChoice)) return interaction.reply(`'${playerChoice}' beats ${sembChoice}, ${user.username} wins!`);
    
    if (playerChoice == 'c2s' || playerChoice == 'celltosingularity') return interaction.reply(`The almight idle-game, Cell to Singularity, defeats ${sembChoice}. ${user.username} wins!`);
    
    if (playerChoice == 'dyno' || playerChoice == 'mee6') return interaction.reply(`'${playerChoice}' instantly loses against ${sembChoice}, ${user.username} didn't stand a chance with their choice.`);
    if (playerChoice == 'karen') return interaction.reply(`The ${playerChoice} loses against ${sembChoice} cause entitlement gets you no where in life.`);
    if (playerChoice == 'ban') return interaction.reply(`Ban wipes your existance, ${sembChoice} is now deleted and ${user.username} automatically loses 🔨!`);
    if (choiceToOutcome(playerChoice, sembChoice) === true) {
        return interaction.reply(`${playerChoice} beats ${sembChoice}, ${user.username} wins!`);
    } else if (choiceToOutcome(playerChoice, sembChoice) === false) {
        return interaction.reply(`${sembChoice} beats ${playerChoice}, ${client.user.username} wins!`);
    } else if (choiceToOutcome(playerChoice, sembChoice) == 'tie') {
        return interaction.reply(`We've both chosen ${playerChoice}, so it's a tie!`);
    }
    interaction.reply(`Due to your choice being invalid, I'mma just say that my choice, ${sembChoice}, beats whatever the heck ${playerChoice} is.`);
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
