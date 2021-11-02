import type { SlashCommand } from '#lib/interfaces/Semblance';

export default {
  permissionRequired: 0,
  run: async interaction => {
    interaction.reply("This slash command hasn't been implemented yet.");
  },
} as SlashCommand;
