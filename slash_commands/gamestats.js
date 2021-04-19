const { MessageEmbed } = require('discord.js'),
    {randomColor} = require('../constants'),
    Game = require('../models/Game').Game;

module.exports = {
    permissionRequired: 0,
    run: async (client, interaction) => {
        let player = (interaction.data.options) ? interaction.data.options[0].value : interaction.member.user.id;
        let statsHandler = await Game.findOne({ player: player });
        if (!statsHandler) return [{ content: "You have not created a game yet; if you'd like to create a game, use `s!game create`" }];
        let nxtUpgrade = await currentPrice(player, statsHandler);
        if (interaction.member.user.id == player) player = interaction.member.user;
        else player = await client.users.fetch(player);
        let embed = new MessageEmbed()
            .setTitle(`${player.username}'s gamestats`)
            .setAuthor(player.tag, player.avatarURL || player.displayAvatarURL())
            .setColor(randomColor)
            .setThumbnail(player.avatarURL || player.displayAvatarURL())
            .addFields(
                { name: 'Level', value: statsHandler.level },
                { name: 'Random-Bucks', value: statsHandler.money },
                { name: 'Percent Increase', value: statsHandler.percentIncrease },
                { name: 'Next Upgrade Cost', value: nxtUpgrade },
                { name: 'Idle Profit', value: statsHandler.idleProfit }
            )
            .setFooter("Remember to vote for Semblance to gain a production boost!");
        return [{ embeds: [embed.toJSON()] }];
    }
}

async function currentPrice(userID, userData) {
    if (userData.level == userData.checkedLevel) {
        userData = await Game.findOneAndUpdate({ player: userID }, {
            $set: { checkedLevel: userData.checkedLevel+1, cost: userData.cost + userData.baseCost * Math.pow(userData.percentIncrease, userData.level + 1) }
        }, { new: true });
        return userData.cost;
    }
    return (userData.cost == 0) ? userData.baseCost : userData.cost;
}