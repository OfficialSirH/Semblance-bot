"use strict";
module.exports.EVENTS = {
    CLIENT: {
        interactionCreate: require("./client/interactionCreate"),
        message: require("./message"),
        messageDelete: require("./messageDelete"),
        messageDM: require("./messageDM"),
        messageReactionAdd: require("./messageReactionAdd"),
        messageReactionRemove: require("./messageReactionRemove"),
        messageUpdate: require("./messageUpdate"),
        ready: require("./ready")
    },
    BOT_LISTING: {
        botListSpace: require("./bot_listing/botListSpace"),
        botsForDiscord: require("./bot_listing/botsForDiscord"),
        discordBoat: require("./bot_listing/discordBoat"),
        discordBotList: require("./bot_listing/discordBotList"),
        discordBotsGG: require("./bot_listing/discordBotsGG")
    },
    TWITTER: {
        checkTweet: require("./checkTweet")
    }
}