import { nameToScNo, bigToName, checkValue } from '#constants/index';
import { MessageEmbed } from 'discord.js';
import type { User } from 'discord.js';
import { randomColor } from '#constants/index';
import { clamp } from '#lib/utils/math';
import type { SlashCommand } from '#lib/interfaces/Semblance';

export default {
  permissionRequired: 0,
  run: async interaction => {
    let options = interaction.options,
      metabits = options.getString('metabit'),
      dinoRanks = options.getInteger('mv_ranks') ? clamp(options.getInteger('mv_ranks'), 0, 550) : 0,
      simSpeed = options.getInteger('speed_upgrades') ? clamp(options.getInteger('speed_upgrades'), 0, 2105) : 0;

    if (!checkValue(metabits))
      return interaction.reply({ content: 'Your input for metabits was invalid', ephemeral: true });
    const metabitCount = nameToScNo(metabits);
    let num = 1.0;

    if (metabitCount > 1000.0) {
      var num2 = metabitCount - 1000.0;
      num += 10.0;

      if (num2 > 100000.0) {
        var num3 = num2 - 100000.0;
        num += 10.0;

        if (num3 > 300000000.0) {
          var num4 = num3 - 300000000.0;
          num += 300;
          if (num4 > 1000000000000.0) {
            let num5 = num4 - 1000000000000.0;
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
      num += metabitCount * 0.009999999776482582;
    }
    let dinoPrestigeBonus =
      dinoRanks == 550
        ? 10
        : Math.ceil(dinoRanks / 50) > Math.floor(dinoRanks / 50)
        ? Math.floor(dinoRanks / 50)
        : Math.floor(dinoRanks / 50) - 1;
    let dinoranksMulti = 1 + dinoRanks * 0.1 + dinoPrestigeBonus * 0.5;
    num *= dinoRanks == 0 ? 1 : dinoranksMulti;
    num *= simSpeed / 100 + 1;
    let user = interaction.member.user as User,
      embed = new MessageEmbed()
        .setTitle('Multiplier Total')
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(
          [
            `Total Collected Metabits/Simulation Level: ${bigToName(metabitCount)}`,
            `Accumulated Mesozoic Valley Ranks: ${dinoRanks}`,
            `Simulation Speed Upgrades: ${simSpeed}%`,
            `Production/Total Multiplier: x${bigToName(num)}`,
          ].join('\n'),
        )
        .setFooter('P.S. Mesozoic Valley rank accumulation caps at 550 and simulation speed upgrades cap at 2105%.');
    return interaction.reply({ embeds: [embed] });
  },
} as SlashCommand;
