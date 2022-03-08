import { bigToName, Categories, randomColor } from '#constants/index';
import { ApplicationCommandOptionType, type CommandInteraction, MessageEmbed } from 'discord.js';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { clamp } from '#lib/utils/math';

export default class MetaspeedCalc extends Command {
  public override name = 'metaspeedcalc';
  public override description = 'Provides the production multiplier for the specified amount of metabits.';
  public override fullCategory = [Categories.calculator];

  public override chatInputRun(interaction: CommandInteraction<'cached'>) {
    const options = interaction.options,
      metabits = options.getNumber('metabits'),
      dinoRanks = options.getInteger('mv_ranks') ? clamp(options.getInteger('mv_ranks'), 0, 550) : 0,
      simSpeed = options.getInteger('speed_upgrades') ? clamp(options.getInteger('speed_upgrades'), 0, 2105) : 0;

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
    const user = interaction.member.user,
      embed = new MessageEmbed()
        .setTitle('Multiplier Total')
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
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
    return interaction.reply({ embeds: [embed] });
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'metabits',
          description: 'The amount of metabits to calculate the multiplier for.',
          type: 'NUMBER',
        },
        {
          name: 'mv_ranks',
          description: 'The amount of Mesozoic Valley ranks to calculate the multiplier for.',
          type: 'INTEGER',
        },
        {
          name: 'speed_upgrades',
          description: 'The amount of simulation speed upgrades to calculate the multiplier for.',
          type: 'INTEGER',
        },
      ],
    });
  }
}
