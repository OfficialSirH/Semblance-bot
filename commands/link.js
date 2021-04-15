const mongoose = require('mongoose'), UserData = mongoose.model('UserData'), 
    { prefix, c2sGuildID } = require('../config.js'), { Collection } = require('discord.js'),
    cooldown = new Collection(), { createHmac } = require('crypto');

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
    const userCooldown = cooldown.get(message.author.id);
    if (userCooldown && userCooldown > Date.now()) return message.channel.send(`You cannot use the link command again for another ${(userCooldown - Date.now())/1000} seconds.`); 
    else cooldown.set(message.author.id, Date.now() + 30000);
    if (args.length == 0) return message.channel.send(`You forgot some input, you need to do \`${prefix}link PLAYER_ID PLAYER_TOKEN\` and replace PLAYER_ID with your player ID and replace PLAYER_TOKEN with your player token`);
    try {
        const isMember = !!(await client.guilds.cache.get(c2sGuildID).members.fetch(message.author.id));
        if (!isMember) return message.channel.send('You need to be a member of the Cell to Singularity community server to use this command.');
    } catch {
        return message.channel.send('You need to be a member of the Cell to Singularity community server to use this command.');
    }
    finally {
        let playerId, playerToken;
        [playerId, playerToken] = args;
        /** Implement HMAC Key creation within this region
         *   Example: const token = createHmac('sha1', process.env.USERDATA_AUTH).update(playerId).update(playerToken).digest('hex');
        */
        const dataAlreadyExists = !!(await UserData.findOne({ playerId, playerToken }));
        if (dataAlreadyExists) return message.channel.send(`The provided data seems to already exist, which means this data is already linked to a discord account, if you feel this is false, please DM the owner(SirH).`);
        const updatedUser = !!(await UserData.findOneAndUpdate({ discordId: message.author.id }, { $set: { playerId, playerToken, edited_timestamp: Date.now() } }, {new: true}));
        if (updatedUser) {
            console.log(`${message.author.tag}(${message.author.id}) successfully linked their C2S data.`); 
            return message.channel.send(`The link was successful, now you can use the Discord button in-game to upload your metabit progress.`);
        }
        const newUser = new UserData({ playerId, playerToken, discordId: message.author.id })
        newUser.save(function(err, entry) {
            if (err) return message.channel.send(`An error occured, either you provided incorrect input or something randomly didn't want to work.`);
            message.channel.send(`The link was successful, now you can use the Discord button in-game to upload your metabit progress.`);
        });         
    }   
}