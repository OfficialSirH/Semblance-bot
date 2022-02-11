import type { SlashCommand } from '#lib/interfaces/Semblance';
import { MessageActionRow, Embed, MessageSelectMenu } from 'discord.js';

export default {
  permissionRequired: 0,
  run: async (interaction, { options, client }) => {
    const query = options.getString('query');
    if (!client.infoBuilders.has(query)) {
      const allQueries = client.infoBuilders.map((_, i) => i);
      const components = allQueries.reduce((acc, cur, i) => {
        const index = Math.floor(i / 25);
        if (!acc[index])
          acc[index] = new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId(
                JSON.stringify({
                  command: 'help',
                  action: `query-${index}`,
                  id: interaction.user.id,
                }),
              )
              .setPlaceholder('Select a query'),
          );
        (acc[index].components[0] as MessageSelectMenu).addOptions({ label: cur, value: cur });
        return acc;
      }, [] as MessageActionRow[]);
      return interaction.reply({
        embeds: [
          new Embed()
            .setTitle('Help')
            .setDescription(
              "Due to your query being wrong, here's a provided list from Semblance's help command in the dropdowns below.",
            ),
        ],
        components,
      });
    }
    const info = await client.infoBuilders.get(query)(interaction, client);
    interaction.reply(info);
  },
} as SlashCommand;
