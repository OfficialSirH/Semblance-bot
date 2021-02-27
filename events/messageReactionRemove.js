const { sembID } = require('../config'), 
    { reactionToRole } = require('../commands/rolereact.js');

module.exports = (client) => {
    client.on("messageReactionRemove", (reaction, user) => {
        if (user.id == sembID) return;
        reactionToRole(reaction, user, false);
    });
}