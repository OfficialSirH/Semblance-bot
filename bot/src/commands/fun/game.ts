import { Category, authorDefault, avatarUrl, randomColor } from '#constants/index';
import { Command } from '#structures/Command';
import { currentPrice } from '#constants/commands';
import { buildCustomId } from '#constants/components';
import { type APIChatInputApplicationCommandGuildInteraction, ButtonStyle } from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import {
  EmbedBuilder,
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
  ButtonBuilder,
} from '@discordjs/builders';

export default class Game extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'game',
      description: 'An idle-game within Semblance',
      fullCategory: [Category.fun],
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    const user = interaction.member.user;

    const statsHandler = await this.client.db.game.findUnique({ where: { player: user.id } }),
      embed = new EmbedBuilder();
    let cost = Infinity;
    if (!statsHandler)
      embed
        .setTitle("Semblance's Idle-Game")
        .setAuthor(authorDefault(user))
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
        .setAuthor(authorDefault(user))
        .setColor(randomColor)
        .setThumbnail(avatarUrl(user))
        .addFields(
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
            value: (await currentPrice(this.client, statsHandler)).toFixed(3).toString(),
          },
          {
            name: 'Idle Profit',
            value: statsHandler.profitRate.toFixed(3).toString(),
          },
        )
        .setFooter({ text: 'Remember to vote for Semblance to gain a production boost!' }),
        (cost = await currentPrice(this.client, statsHandler));

    const components = [
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(
            buildCustomId({
              command: 'game',
              action: 'about',
              id: user.id,
            }),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji({ name: '❔' })
          .setLabel('About'),
        new ButtonBuilder()
          .setCustomId(
            buildCustomId({
              command: 'game',
              action: 'collect',
              id: user.id,
            }),
          )
          .setDisabled(!statsHandler)
          .setStyle(ButtonStyle.Primary)
          .setEmoji({ name: '💵' })
          .setLabel('Collect'),
        new ButtonBuilder()
          .setCustomId(
            buildCustomId({
              command: 'game',
              action: 'upgrade',
              id: user.id,
            }),
          )
          .setDisabled(!statsHandler || statsHandler.money < cost)
          .setStyle(ButtonStyle.Primary)
          .setEmoji({ name: '⬆' })
          .setLabel('Upgrade'),
        new ButtonBuilder()
          .setCustomId(
            buildCustomId({
              command: 'game',
              action: 'leaderboard',
              id: user.id,
            }),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji({ name: '🏅' })
          .setLabel('Leaderboard'),
        new ButtonBuilder()
          .setCustomId(
            buildCustomId({
              command: 'game',
              action: 'vote',
              id: user.id,
            }),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji({ name: '💰' })
          .setLabel('Voting Sites'),
      ),
    ].map(row => row.toJSON());

    await this.client.api.interactions.reply(res, {
      embeds: [embed.toJSON()],
      components,
    });
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
    };
  }
}
