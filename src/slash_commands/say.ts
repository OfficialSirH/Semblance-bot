import { Util, CommandInteraction } from 'discord.js';
import { Semblance } from '../structures';

module.exports = {
    permissionRequired: 0,
    run: async (client: Semblance, interaction: CommandInteraction, { permissionLevel, options }) => {
        if (permissionLevel >= 6) return interaction.reply(options.get('message').value);
        interaction.reply(Util.removeMentions(options.get('message').value));
    }
}
