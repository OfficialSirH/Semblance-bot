const { TurnPage } = require('../commands/gametransfer.js');

module.exports = (client) => {
    client.on("messageReactionAdd", (reaction, user) => {
        if(user.id == client.user.id) return; 
        TurnPage(client, reaction, user);
    });
}