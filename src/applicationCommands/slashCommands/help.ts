import type { SlashCommand } from '#lib/interfaces/Semblance';

export default {
  permissionRequired: 0,
  run: async (interaction, { options, client }) => {
    const query = options.getString('query');
    if (!client.infoBuilders.has(query)) return interaction.reply('Invalid query');
    const info = await client.infoBuilders.get(query)(interaction, client);
    interaction.reply(info);
  },
} as SlashCommand;
