import { nameToScNo, bigToName, checkValue } from '#constants/index';
import { Embed } from 'discord.js';
import type { User } from 'discord.js';
import { randomColor } from '#constants/index';
import type { SlashCommand } from '#lib/interfaces/Semblance';

export default {
  permissionRequired: 0,
  run: async interaction => {
    let entropy = interaction.options.get('entropy').value,
      ideas = interaction.options.get('idea').value,
      failed = false;
    if (!checkValue(entropy as string))
      return interaction.reply({
        content: 'Your input for entropy was invalid',
        ephemeral: true,
      });
    if (!checkValue(ideas as string))
      return interaction.reply({
        content: 'Your input for ideas was invalid',
        ephemeral: true,
      });
    try {
      entropy = (entropy as string).match(/[a-z]/i) ? nameToScNo(entropy as string) : parseInt(entropy as string);
      ideas = (ideas as string).match(/[a-z]/i) ? nameToScNo(ideas as string) : parseInt(ideas as string);
    } catch {
      failed = true;
      return interaction.reply({
        content: 'Something went wrong, please try again',
        ephemeral: true,
      });
    }
    if (failed) return;
    const metabits = Math.floor(Math.pow((entropy as number) + (ideas as number), 0.3333333333333333) / 10000 - 1),
      user = interaction.member.user as User,
      embed = new Embed()
        .setTitle('Metabits Produced')
        .setColor(randomColor)
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setDescription(
          `Entropy Input: ${entropy}\nIdea Input: ${ideas}\n\nMetabits Produced: ${
            metabits < 1 ? 0 : bigToName(metabits)
          }`,
        );
    return interaction.reply({ embeds: [embed] });
  },
} as SlashCommand;
