import type { SlashCommand } from '#lib/interfaces/Semblance';
import { messageLinkJump } from '#src/constants/commands';

export default {
  permissionRequired: 0,
  run: async (interaction, { options, client }) => {
    const input = options.getString('link', true);

    const output = await messageLinkJump(input, interaction.user, interaction.guild, client);
    interaction.reply(output);
  },
} as SlashCommand;
