"use strict";
module.exports.EVENTS = {
    CLIENT: {
        interactionCreate: require("./client/interactionCreate"),
        message: require("./client/message"),
        messageDelete: require("./client/messageDelete"),
        messageDM: require("./client/messageDM"),
        messageReactionAdd: require("./client/messageReactionAdd"),
        messageReactionRemove: require("./client/messageReactionRemove"),
        messageUpdate: require("./client/messageUpdate"),
        ready: require("./client/ready")
    },
    BOT_LISTING: {
        botListSpace: require("./bot_listing/botListSpace"),
        botsForDiscord: require("./bot_listing/botsForDiscord"),
        discordBoat: require("./bot_listing/discordBoat"),
        discordBotList: require("./bot_listing/discordBotList"),
        discordBotsGG: require("./bot_listing/discordBotsGG"),
        topGG: require('./bot_listing/topGG')
    },
    TWITTER: {
        checkTweet: require("./checkTweet")
    }
}