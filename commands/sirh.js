const { MessageEmbed } = require('discord.js'), {randomColor} = require('../constants');

module.exports = {
    description: "Secret command about SirH",
    category: 'secret',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    aliases: [],
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    // Will be implementing some secrets here later, not sure what it will be yet
}