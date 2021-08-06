import { MessageEmbed, CommandInteraction, User, GuildMember, MessageActionRow, MessageButton, Message } from 'discord.js';
import { Semblance } from '../structures';
import { choiceToOutcome, countdownGIF, randomChoice } from '../constants/commands';
import { rpsGames } from '../componentHandlers/rps';
import { randomColor } from '../constants';

module.exports.permissionRequired = 0;

module.exports.run = async (client: Semblance, interaction: CommandInteraction) => {
    if (rpsGames.has(interaction.user.id)) return interaction.reply({ content: 'You have an RPS game still running, please finish your previous game first', ephemeral: true });
    const { user } = interaction, gaveChoice = !!interaction.options.getString('choice'), gaveOpponent = !!interaction.options.getUser('opponent');
    let choice = interaction.options.getString('choice'), opponent: User | GuildMember = interaction.options.getUser('opponent');
    try {
        if (!gaveOpponent) opponent = await interaction.guild.members.fetch(client.user.id);
        else opponent = await interaction.guild.members.fetch(opponent.id);
    } catch (err) { 
        return await interaction.reply({ content: "The opponent you choose isn't a part of this guild (or the command just wanted to have an issue).", ephemeral: true });
    } finally {
        if (opponent.id == user.id) return interaction.reply({ content: "Are you this lonely that you chose to face yourself? I'm sorry, but that's not how this game works.", ephemeral: true });
        if (user.bot && user.id != client.user.id) return interaction.reply(`You can't face a bot (except for me) so what are you doing trying to fight, ${(opponent as GuildMember).user.tag}?`);
        const components = [new MessageActionRow()
        .addComponents([new MessageButton()
            .setLabel('Rock')
            .setCustomId(JSON.stringify({
                command: 'rps',
                action: 'rock',
                id: user.id
            }))
            .setEmoji('🪨')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setLabel('Paper')
            .setCustomId(JSON.stringify({
                command: 'rps',
                action: 'paper',
                id: user.id
            }))
            .setEmoji('📄')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setLabel('Scissors')
            .setCustomId(JSON.stringify({
                command: 'rps',
                action: 'scissors',
                id: user.id
            }))
            .setEmoji('✂')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setLabel('Lizard')
            .setCustomId(JSON.stringify({
                command: 'rps',
                action: 'lizard',
                id: user.id
            }))
            .setEmoji('🦎')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setLabel('Spock')
            .setCustomId(JSON.stringify({
                command: 'rps',
                action: 'spock',
                id: user.id
            }))
            .setEmoji('👽')
            .setStyle('SECONDARY')
        ])],
        embed = new MessageEmbed()
        .setTitle(`${user.tag} has challenged ${(opponent as GuildMember).user.tag} to Rock, Paper, Scissors, Lizard, Spock!`)
        .setThumbnail(countdownGIF)
        .setColor(randomColor)
        .setDescription('Make your choice with one of the buttons below.');
        const awaitingText = gaveChoice ? `Awaiting for **${(opponent as GuildMember).user.tag}**` : `Awaiting for **${user.tag}** and **${(opponent as GuildMember).user.tag}**`,
        semblanceChoice = randomChoice();
        if (opponent.id == client.user.id) {
            if (gaveChoice) {
                let endTemplate = `${user.tag} chose ${choice} and ${client.user.tag} chose ${semblanceChoice}, leading to `, playerVictory = choiceToOutcome(choice, semblanceChoice);            
                
                if (playerVictory == 'tie') endTemplate = `${user.tag} and ${client.user.tag} both chose ${choice} so it's a tie!`;
                else if (playerVictory) endTemplate += `${user.tag}'s victory!`;
                else endTemplate += `${client.user.tag}'s victory!`; 

                return await interaction.reply(endTemplate);
            } else 
            await interaction.reply({ content: `Awaiting for **${user.tag}**`, embeds: [embed], components });
        } else
        await interaction.reply({ content: awaitingText, embeds: [embed], components });
        const rpsMessage = await interaction.fetchReply() as Message;
        rpsGames.set(user.id, {
            player: {
                id: user.id,
                tag: user.tag,
                choice: (gaveChoice) ? choice : ''
            },
            opponent: {
                id: opponent.id,
                tag: (opponent as GuildMember).user.tag,
                choice: (opponent.id == client.user.id) ? semblanceChoice : ''
            },
            timeout: setTimeout(async () => {
                if (rpsGames.has(user.id)) await rpsMessage.edit({ content: null, 
                    embeds: [rpsMessage.embeds[0].setTitle('RPS game has timed out').setDescription('Someone took too long to make a choice. :(')],
                    components: []
                });
                rpsGames.delete(user.id)
            }, 60000)
        });
    }

}
