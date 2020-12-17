const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js'), Information = require('../models/Information.js');

module.exports = {
    description: "Used for editing information on the beta and update commands",
    usage: {
        "<beta/update>": "arguments for deciding which information you want to edit"
    },
    permissionRequired: 7,
    checkArgs: (args) => args.length >= 1,
    information: Information
}

module.exports.run = async (client, message, args) => {
    if (!args[1] || args[1].length == 0) return message.reply("Why are you trying to put nothing for the information? Come on!");
    if (args[0] == 'beta') {
        let infoHandler = await Information.findOneAndUpdate({ infoType: "beta" }, { $set: { info: args.slice(1).join(" ") } }, { new: true });
        let embed = new MessageEmbed()
            .setTitle("Beta Info Changed!")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor(randomColor())
            .setDescription(infoHandler.info);
        message.channel.send(embed);
    } else if (args[0] == 'update') {
        let infoHandler = await Information.findOneAndUpdate({ infoType: "update" }, { $set: { info: args.slice(1).join(" ") } }, { new: true });
        let embed = new MessageEmbed()
            .setTitle("Update Info Changed!")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor(randomColor())
            .setDescription(infoHandler.info);
        message.channel.send(embed);
    } else if (args[0] == 'codes') {
        let infoHandler;
        if (args[1] == 'expired') infoHandler = await Information.findOneAndUpdate({ infoType: "codes" }, { $set: { expired: args.slice(2).join(" ") } }, { new: true });
        else infoHandler = await Information.findOneAndUpdate({ infoType: "codes" }, { $set: { info: args.slice(1).join(" ") } }, { new: true });
        let embed = new MessageEmbed()
            .setTitle("Code List Changed!")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor(randomColor())
            .setDescription(infoHandler.info)
            .addField("Expired Codes", infoHandler.expired);
        message.channel.send(embed);
    } else message.channel.send("What are you trying to type? The options are `beta`, `update`, and 'codes'");
}