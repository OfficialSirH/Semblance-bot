const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js');

module.exports = {
    description: "Provides user statistics, including their Semblance idle-game stats.",
    usage: {
        "<User Mention/User ID>": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 1
}

module.exports.run = async (client, message, args) => {
    return message.reply(["This command is currently being worked on and was removed a little while ago due to some issues.",
        "Also, a message to the moderator of Discord Boats who denied my bot, this command won't do anything else for a while so please don't deny Semblance(again) for this command. lol"].join("\n"));
}