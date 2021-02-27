const { sembID } = require('../config'),
    { reactionToRole } = require('../commands/rolereact.js'),
	{ TurnPage } = require('../commands/gametransfer.js');

module.exports = (client) => {
    client.on("messageReactionAdd", (reaction, user) => {
        if(user.id == sembID) return; 
        TurnPage(client, reaction, user);
        reactionToRole(reaction, user, true);
    });
}