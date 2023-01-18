import { Category, randomColor } from '#constants/index';
import { currentPrice } from '#constants/commands';
import { Command } from '#structures/Command';
import {
  ApplicationCommandOptionType,
  APIChatInputApplicationCommandGuildInteraction,
  MessageFlags,
  RESTPostAPIApplicationCommandsJSONBody,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import { chatInputApplicationCommandMention, EmbedBuilder } from '@discordjs/builders';

export default class Gamestats extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'gamestats',
      description: "Displays a user's game stats for Semblance Idle-Game.",
      fullCategory: [Category.fun],
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    let user = options.getUser('user');
    if (!user) user = interaction.user;

    const statsHandler = await this.client.db.game.findUnique({ where: { player: user.id } });
    if (!statsHandler)
      return this.client.api.interactions.reply(res, {
        content:
          user.id != interaction.user.id
            ? 'This user does not exist'
            : `You have not created a game yet; if you'd like to create a game, use \`${chatInputApplicationCommandMention(
                interaction,
                'create',
              )}\``,
        flags: MessageFlags.Ephemeral,
      });
    const nxtUpgrade = await currentPrice(this.client, statsHandler);
    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s gamestats`)
      .setAuthor(user)
      .setColor(randomColor)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'Level', value: statsHandler.level.toString() },
        { name: 'Random-Bucks', value: statsHandler.money.toString() },
        {
          name: 'Percent Increase',
          value: statsHandler.percentIncrease.toString(),
        },
        { name: 'Next Upgrade Cost', value: nxtUpgrade.toString() },
        { name: 'Idle Profit', value: statsHandler.profitRate.toString() },
      )
      .setFooter({ text: 'Remember to vote for Semblance to gain a production boost!' });
    return this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
  }

  public override data() {
    return {
      command: {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'user',
            description: 'The user to display stats for.',
            type: ApplicationCommandOptionType.User,
          },
        ],
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
    };
  }
}
