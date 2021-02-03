const { Util } = require('discord.js');

module.exports = {
    permissionRequired: 0,
    run: async (client, interaction, { permissionLevel, options }) => {
        if (permissionLevel >= 6) return [{ content: options[0].value }];
        return [{ content: Util.removeMentions(options[0].value) }];
    }
}
