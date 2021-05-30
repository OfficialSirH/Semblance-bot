import { Util } from 'discord.js';
import { Semblance, Interaction } from '../structures';

module.exports = {
    permissionRequired: 0,
    run: async (client: Semblance, interaction: Interaction, { permissionLevel, options }) => {
        if (permissionLevel >= 6) return interaction.send(options[0].value);
        interaction.send(Util.removeMentions(options[0].value));
    }
}
