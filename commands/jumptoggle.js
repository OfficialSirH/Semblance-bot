const { MessageEmbed } = require('discord.js'),
    JTModel = require('../models/Jump.js');

module.exports = {
    description: "The command toggles a feature that will convert a user's message that contains a message link to an embed that provides the details of the specified message link",
    usage: {
        "<true/t or false/f>": ""
    },
    permissionRequired: 1,
    aliases: ['jump', 'jt'],
    checkArgs: (args) => args.length >= 1
}

module.exports.run = async (client, message, args) => {
    let choice = args[0].toLowerCase();
    let toggleHandler = await JTModel.findOne({ guild: message.guild.id });
    if (choice == 't' || choice == 'true') {
        if (toggleHandler && toggleHandler.active) return message.reply("You've already got `jump` enabled on this guild.");
        else if (toggleHandler && !toggleHandler.active) {
            toggleHandler = await JTModel.findOneAndUpdate({ guild: message.guild.id }, { $set: { active: true } }, { new: true });
            message.channel.send("Jump message converter is now **active**.");
        } else {
            toggleHandler = new JTModel({ guild: message.guild.id });
            await toggleHandler.save();
            message.channel.send("Jump message converter is now **active**.");
        }
    } else if (choice == 'f' || choice == 'false') {
        if (toggleHandler && !toggleHandler.active) return message.reply("You've already got `jump` disabled on this guild.");
        else if (toggleHandler && toggleHandler.active) {
            toggleHandler = await JTModel.findOneAndUpdate({ guild: message.guild.id }, { $set: { active: false } }, { new: true });
            message.channel.send("Jump message converter is now **inactive**.");
        } else {
            //toggleHandler = new JTModel({ guild: message.guild.id, active: false });
            message.channel.send("Disabling this isn't required as it is disabled by default.");
        }
    } else {
        return message.reply("Incorrect argument, the allowed arguments are true/t or false/f");
    }
}