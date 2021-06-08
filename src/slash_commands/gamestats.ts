import { MessageEmbed, User, CommandInteraction } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Game } from '@semblance/models';
import { Semblance } from '../structures';
import { GameFormat } from '../models/Game';

module.exports = {
    permissionRequired: 0,
    run: async (client: Semblance, interaction: CommandInteraction) => {
        let player: string | User = (!!interaction.options[0]) ? interaction.options[0].value as string : interaction.member.user.id;
        let statsHandler = await Game.findOne({ player: player as string });
        if (!statsHandler) return interaction.reply(!!interaction.options[0] ? 
            'This user does not exist' :
            "You have not created a game yet; if you'd like to create a game, use `s!game create`", { ephemeral: true });
        let nxtUpgrade = await currentPrice(statsHandler);
        if (interaction.user.id == player) player = interaction.user;
        else player = await client.users.fetch(player as string);
        let embed = new MessageEmbed()
            .setTitle(`${player.username}'s gamestats`)
            .setAuthor(player.tag, player.displayAvatarURL())
            .setColor(randomColor)
            .setThumbnail(player.displayAvatarURL())
            .addFields(
                { name: 'Level', value: statsHandler.level },
                { name: 'Random-Bucks', value: statsHandler.money },
                { name: 'Percent Increase', value: statsHandler.percentIncrease },
                { name: 'Next Upgrade Cost', value: nxtUpgrade },
                { name: 'Idle Profit', value: statsHandler.idleProfit }
            )
            .setFooter("Remember to vote for Semblance to gain a production boost!");
        return interaction.reply(embed);
    }
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
