import type { SlashCommand } from "@semblance/lib/interfaces/Semblance";

export default {
    permissionRequired: 0,
    run: (interaction, { client }) => {
        return interaction.reply({ content: `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot+applications.commands`, ephemeral: true });
    }
} as SlashCommand;