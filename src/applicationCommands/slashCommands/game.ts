import type { SlashCommand } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { currentPrice } from '#constants/commands';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';

export default {
  permissionRequired: 0,
  run: async (interaction, { client }) => {
    const { user } = interaction;
    const statsHandler = await client.db.game.findUnique({ where: { player: user.id } }),
      embed = new MessageEmbed();
    let cost: number;
    if (!statsHandler)
      embed
        .setTitle("Semblance's Idle-Game")
        .setAuthor(user.tag, user.displayAvatarURL())
        .setDescription(
          [
            'Use the buttons below to play the game. :D',
            "If you can't see the buttons, you need to update your Discord.\n",
            'About - explains the game and its rules',
            'Collect - collect earnings',
            'Upgrade - upgrade profit',
            'Leaderboard - see top 20 players',
            'Vote - list of voting sites to earn bonus currency',
          ].join('\n'),
        );
    else
      embed
        .setTitle("Welcome back to Semblance's Idle-Game!")
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(randomColor)
        .setThumbnail(user.displayAvatarURL())
        .addFields([
          { name: 'Level', value: statsHandler.level.toString() },
          {
            name: 'Random-Bucks',
            value: statsHandler.money.toFixed(3).toString(),
          },
          {
            name: 'Percent Increase',
            value: statsHandler.percentIncrease.toString(),
          },
          {
            name: 'Next Upgrade Cost',
            value: (await currentPrice(client, statsHandler)).toFixed(3).toString(),
          },
          {
            name: 'Idle Profit',
            value: statsHandler.profitRate.toFixed(3).toString(),
          },
        ])
        .setFooter('Remember to vote for Semblance to gain a production boost!'),
        (cost = await currentPrice(client, statsHandler));

    const components = [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(
            JSON.stringify({
              command: 'game',
              action: 'about',
              id: user.id,
            }),
          )
          .setStyle('PRIMARY')
          .setEmoji('❔')
          .setLabel('About'),
        new MessageButton()
          .setCustomId(
            JSON.stringify({
              command: 'game',
              action: 'collect',
              id: user.id,
            }),
          )
          .setDisabled(!statsHandler)
          .setStyle('PRIMARY')
          .setEmoji('💵')
          .setLabel('Collect'),
        new MessageButton()
          .setCustomId(
            JSON.stringify({
              command: 'game',
              action: 'upgrade',
              id: user.id,
            }),
          )
          .setDisabled(!statsHandler || statsHandler.money < cost)
          .setStyle('PRIMARY')
          .setEmoji('⬆')
          .setLabel('Upgrade'),
        new MessageButton()
          .setCustomId(
            JSON.stringify({
              command: 'game',
              action: 'leaderboard',
              id: user.id,
            }),
          )
          .setStyle('PRIMARY')
          .setEmoji('🏅')
          .setLabel('Leaderboard'),
        new MessageButton()
          .setCustomId(
            JSON.stringify({
              command: 'game',
              action: 'vote',
              id: user.id,
            }),
          )
          .setStyle('PRIMARY')
          .setEmoji('💰')
          .setLabel('Voting Sites'),
      ),
    ];

    return interaction.reply({
      embeds: [embed],
      components,
    });
  },
} as SlashCommand;
