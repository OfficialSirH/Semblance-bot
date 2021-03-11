

module.exports = (client) => {
    client.on("messageReactionRemove", (reaction, user) => {
        if (user.id == client.user.id) return;
    });
}