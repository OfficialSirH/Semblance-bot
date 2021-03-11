const { reactionToRole } = require('../commands/rolereact.js');

module.exports = (client) => {
    client.on("messageReactionRemove", (reaction, user) => {
        if (user.id == client.user.id) return;
        reactionToRole(reaction, user, false);
    });
}