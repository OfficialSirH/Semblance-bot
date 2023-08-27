import { authorDefault, bigToName, Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';
import { clamp } from '#lib/utils/math';
import {
  type APIChatInputApplicationCommandGuildInteraction,
  ApplicationCommandOptionType,
  type RESTPostAPIApplicationCommandsJSONBody,
} from '@discordjs/core';
import type { InteractionOptionResolver } from '#structures/InteractionOptionResolver';
import { EmbedBuilder } from '@discordjs/builders';
import type { FastifyReply } from 'fastify';

export default class MetaspeedCalc extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'metaspeedcalc',
      description: 'Provides the production multiplier for the specified amount of metabits.',
      fullCategory: [Category.calculator],
    });
  }

  public override chatInputRun(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const metabits = options.getNumber('metabits', true),
      dinoRanks = options.getInteger('mv_ranks') ? clamp(options.getInteger('mv_ranks') || 0, 0, 550) : 0,
      simSpeed = options.getInteger('speed_upgrades') ? clamp(options.getInteger('speed_upgrades') || 0, 0, 2105) : 0;
    if (!metabits && dinoRanks == 0 && simSpeed == 0) return;

    let num = 1.0;

    if (metabits > 1000.0) {
      const num2 = metabits - 1000.0;
      num += 10.0;

      if (num2 > 100000.0) {
        const num3 = num2 - 100000.0;
        num += 10.0;

        if (num3 > 300000000.0) {
          const num4 = num3 - 300000000.0;
          num += 300;
          if (num4 > 1000000000000.0) {
            const num5 = num4 - 1000000000000.0;
            num += 10000.0;
            num += (num5 * 0.009999999776482582) / 100000000.0;
          } else {
            num += (num4 * 0.009999999776482582) / 1000000.0;
          }
        } else {
          num += (num3 * 0.009999999776482582) / 10000.0;
        }
      } else {
        num += (num2 * 0.009999999776482582) / 100.0;
      }
    } else {
      num += metabits * 0.009999999776482582;
    }
    const dinoPrestigeBonus =
      dinoRanks == 550
        ? 10
        : Math.ceil(dinoRanks / 50) > Math.floor(dinoRanks / 50)
        ? Math.floor(dinoRanks / 50)
        : Math.floor(dinoRanks / 50) - 1;
    const dinoranksMulti = 1 + dinoRanks * 0.1 + dinoPrestigeBonus * 0.5;
    num *= dinoRanks == 0 ? 1 : dinoranksMulti;
    num *= simSpeed / 100 + 1;

    const embed = new EmbedBuilder()
      .setTitle('Multiplier Total')
      .setAuthor(authorDefault(interaction.member.user))
      .setColor(randomColor)
      .setDescription(
        [
          `Total Collected Metabits/Simulation Level: ${bigToName(metabits)}`,
          `Accumulated Mesozoic Valley Ranks: ${dinoRanks}`,
          `Simulation Speed Upgrades: ${simSpeed}%`,
          `Production/Total Multiplier: x${bigToName(num)}`,
        ].join('\n'),
      )
      .setFooter({
        text: 'P.S. Mesozoic Valley rank accumulation caps at 550 and simulation speed upgrades cap at 2105%.',
      });
    return this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
  }

  public override data() {
    return {
      command: {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'metabits',
            description: 'The amount of metabits to calculate the multiplier for.',
            type: ApplicationCommandOptionType.Number,
            required: true,
          },
          {
            name: 'mv_ranks',
            description: 'The amount of Mesozoic Valley ranks to calculate the multiplier for.',
            type: ApplicationCommandOptionType.Integer,
          },
          {
            name: 'speed_upgrades',
            description: 'The amount of simulation speed upgrades to calculate the multiplier for.',
            type: ApplicationCommandOptionType.Integer,
          },
        ],
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
    };
  }
}
