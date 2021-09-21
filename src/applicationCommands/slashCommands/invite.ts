import { CommandInteraction } from 'discord.js';
import { Semblance } from '../../structures';

module.exports = {
    permissionRequired: 0,
    run: async (client: Semblance, interaction: CommandInteraction) => {
        return await interaction.reply({ content: `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot+applications.commands`, ephemeral: true });
    }
}