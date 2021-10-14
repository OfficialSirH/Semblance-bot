import type { SlashCommand } from "@semblance/lib/interfaces/Semblance";

export default {
    permissionRequired: 0,
    run: async (interaction, { permissionLevel, options }) => {
        if (permissionLevel >= 6) return interaction.reply({ content: options.getString('message'), allowedMentions: { parse: ['users', 'roles'] } });
        interaction.reply(options.getString('message'));
    }
} as SlashCommand;