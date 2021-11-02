import { SlashCommand } from '#lib/interfaces/Semblance';

export default {
  permissionRequired: 0,
  run: async (interaction, { options }) => {
    const playerId = options.getString('playerId'),
      playerToken = options.getString('playerToken');
    interaction.reply("This slash command hasn't been implemented yet.");
  },
} as SlashCommand;
