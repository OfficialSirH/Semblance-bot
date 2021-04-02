const mongoose = require('mongoose'), UserData = mongoose.model('UserData'), { prefix, c2sGuildID } = require('../config.js');

module.exports = {
    description: 'used for linking the C2S player\'s game with their Discord account.',
    category: 'dm',
    usage: {
        "PLAYER_ID": "The user's in-game ID",
        "PLAYER_TOKEN": "The user's in-game token"
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 2
}

module.exports.run = async (client, message, args) => {
    if (message.channel.type != 'dm') return;
    if (args.length == 0) return message.channel.send(`You forgot some input, you need to do \`${prefix}link PLAYER_ID PLAYER_TOKEN\` and replace PLAYER_ID with your player ID and replace PLAYER_TOKEN with your player token`);
    const isMember = !!(await client.guilds.cache.get(c2sGuildID).members.fetch(message.author.id));
    if (!isMember) return message.channel.send('You need to be a member of the Cell to Singularity community server to use this command.');
    let playerId, playerToken;
    [playerId, playerToken] = args;
    const dataAlreadyExists = !!(await UserData.findOne({ playerId, playerToken }));
    if (dataAlreadyExists) return message.channel.send(`The provided data seems to already exist, which means this data is already link to a discord account, if you feel this is false, please DM the owner(SirH).`);
    UserData.findOneAndUpdate({ discordId: message.author.id }, { $set: { playerId, playerToken, edited_timestamp: Date.now() } }, {new: true}, function(err, entry) {
        if (err) {
            const newUser = new UserData({ playerId, playerToken, discordId: message.author.id })
            newUser.save(function(err, entry) {
                if (err) return message.channel.send(`An error occured, either you provided wrong incorrect input or something randomly didn't want to work.`);
                message.channel.send(`The link was successful, now you can use the Discord button in-game to upload your metabit progress.`);
            });
            return;
        }
    });
}