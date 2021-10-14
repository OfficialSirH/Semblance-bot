import { MessageEmbed } from 'discord.js';
import type { User, Snowflake } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Game } from '@semblance/models';
import { GameFormat } from '../../models/Game';
import config from '@semblance/config';
import type { SlashCommand } from '@semblance/lib/interfaces/Semblance';
const { prefix } = config;

export default {
    permissionRequired: 0,
    run: async (interaction, { client }) => {
        let player: Snowflake | User = interaction.options.getUser('user') ? interaction.options.getUser('user').id : interaction.member.user.id;
        let statsHandler = await Game.findOne({ player: player as Snowflake });
        if (!statsHandler) return interaction.reply({ content: interaction.options.getUser('user') ? 
            'This user does not exist' :
            `You have not created a game yet; if you'd like to create a game, use \`${prefix}game create\``, ephemeral: true });
        let nxtUpgrade = await currentPrice(statsHandler);
        if (interaction.user.id == player) player = interaction.user;
        else player = await client.users.fetch(player as Snowflake);
        let embed = new MessageEmbed()
            .setTitle(`${player.username}'s gamestats`)
            .setAuthor(player.tag, player.displayAvatarURL())
            .setColor(randomColor)
            .setThumbnail(player.displayAvatarURL())
            .addFields([
                { name: 'Level', value: statsHandler.level.toString() },
                { name: 'Random-Bucks', value: statsHandler.money.toString() },
                { name: 'Percent Increase', value: statsHandler.percentIncrease.toString() },
                { name: 'Next Upgrade Cost', value: nxtUpgrade.toString() },
                { name: 'Idle Profit', value: statsHandler.idleProfit.toString() }
            ])
            .setFooter("Remember to vote for Semblance to gain a production boost!");
        return interaction.reply({ embeds: [embed] });
    }
} as SlashCommand;

async function currentPrice(userData: GameFormat) {
    if (userData.level == userData.checkedLevel) {
        userData = await Game.findOneAndUpdate({ player: userData.player }, {
            $set: { checkedLevel: userData.checkedLevel+1, cost: userData.cost + userData.baseCost * Math.pow(userData.percentIncrease, userData.level + 1) }
        }, { new: true });
        return userData.cost;
    }
    return (userData.cost == 0) ? userData.baseCost : userData.cost;
}
