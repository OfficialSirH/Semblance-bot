const { sembcommunist } = require('../config.js'), { MessageEmbed, Util } = require('discord.js'),
    c2sList = ['semblance', 'nuke', 'lunch', 'computerlunch', 'aditya', 'tacocubes', 'beyond', 
                'trex', 'devs', 'singularity', '0nrd', '0nrd0r4', 'Magneto'];

module.exports.permissionRequired = 0;

module.exports.run = async (client, interaction) => {
    let choice = interaction.data.options[0].value,
        user = interaction.member.user;
    if (choice.length == 0) return [{ content: 'rps stands for "Rock, Paper, Scissors", which you can play with me by choosing one of the **Five** (Don\'t forget Lizard and Spock) and I\'ll choose one as well and we\'ll see who wins, there\'s also secret bonuses. :D' }];
    choice = Util.removeMentions(choice);
    let randomFailure = Math.ceil(Math.random() * 100);
    if (randomFailure == 100) return [{ content: '***Error Ocurred... rebooting, try again in a moment.***' }];
    let sembRandomness = Math.ceil(Math.random() * 5), sembChoice = convertNumberToChoice(sembRandomness);
    let playerChoice = choice.toLowerCase();
    if (playerChoice == 'senate') {
        let embed = new MessageEmbed()
            .setDescription('I *am* the senate, which means ***WE*** win this round!')
            .attachFiles(sembcommunist)
            .setImage('attachment://CommunistSemblance.jpg');
        return [{ embeds: [embed] }];
    }
    if (playerChoice == 'everything') return [{ content: `What the heck dude?! You don't need to use ***everything*** against ${sembChoice}!! You destroyed it after the *first* thing you threw at it, which was a nuclear bomb!!!` }];
    if (playerChoice == 'logic') return [{ content: `With the power of ***logic***, you ask ${sembChoice} how much wood could a woodchuck chuck wood if a woodchuck could chuck wood, which then the ${sembChoice} vanishes from thinking too hard, ${user.username} wins!` }];
    if (playerChoice == 'thanos') return [{ content: `Thanos wipes out half of ${sembChoice}, now the ${sembChoice} avengers will get revenge on Thanos in End Game.` }];
    if (playerChoice == 'rps') return [{ content: `With the power of ***rock, paper, and scissors*** you **obliterate** ${sembChoice}, ${user.username} wins!` }];
    if (playerChoice == 'sirh') return [{ content: `SirH deletes ${sembChoice}, ${user.username} wins!` }];
    if (playerChoice == 'hype') return [{ content: `${sembChoice} gets disintegrated by the sight of Hype, ${user.username} wins!` }];

    if (c2sList.includes(playerChoice)) return [{ content: `'${playerChoice}' beats ${sembChoice}, ${user.username} wins!` }];
    
    if (playerChoice == 'c2s' || playerChoice == 'celltosingularity') return [{ content: `The almight idle-game, Cell to Singularity, defeats ${sembChoice}. ${user.username} wins!` }];
    
    if (playerChoice == 'dyno' || playerChoice == 'mee6') return [{ content: `'${playerChoice}' instantly loses against ${sembChoice}, ${user.username} didn't stand a chance with their choice.` }];
    if (playerChoice == 'karen') return [{ content: `The ${playerChoice} loses against ${sembChoice} cause entitlement gets you no where in life.` }];
    if (playerChoice == 'ban') return [{ content: `Ban wipes your existance, ${sembChoice} is now deleted and ${user.username} automatically loses 🔨!` }];
    if (choiceToOutcome(playerChoice, sembChoice) === true) {
        return [{ content: `${playerChoice} beats ${sembChoice}, ${user.username} wins!` }];
    } else if (choiceToOutcome(playerChoice, sembChoice) === false) {
        return [{ content: `${sembChoice} beats ${playerChoice}, ${client.user.username} wins!` }];
    } else if (choiceToOutcome(playerChoice, sembChoice) == 'tie') {
        return [{ content: `We've both chosen ${playerChoice}, so it's a tie!` }];
    }
    return [{ content: `Due to your choice being invalid, I'mma just say that my choice, ${sembChoice}, beats whatever the heck ${playerChoice} is.` }];
}

function convertNumberToChoice(number) {
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

function choiceToOutcome(choice, sembChoice) {
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
