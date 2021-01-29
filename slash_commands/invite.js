const { sembID } = require('../config');

module.exports = {
    permissionRequired: 0,
    run: async (client, interaction) => {
        return [{ content: `https://discord.com/oauth2/authorize?client_id=${sembID}&permissions=8&scope=bot+applications.commands`, flags: 1 << 6 }];
    }
}