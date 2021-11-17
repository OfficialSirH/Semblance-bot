import type { SlashCommand } from '#lib/interfaces/Semblance';
import { exec } from 'child_process';
import { MessageEmbed } from 'discord.js';

export default {
  permissionRequired: 7,
  run: async interaction => {
    await interaction.deferReply();
    const embeds = [new MessageEmbed().setColor('DARKER_GREY')];
    exec(interaction.options.getString('input'), (error, stdout, stderr) => {
      if (error) embeds[0].setDescription(`\`\`\`js\n${error}\`\`\``);
      if (stderr) embeds[0].setDescription(`\`\`\`js\n${stderr}\`\`\``);
      else embeds[0].setDescription(`\`\`\`js\n${stdout}\`\`\``);
      return interaction.editReply({ embeds });
    });
  },
} as SlashCommand;
