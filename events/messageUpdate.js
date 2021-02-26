const { MessageEmbed } = require('discord.js'), { getPermissionLevel } = require('../constants'),
    { prefix, c2sID } = require('../config');

module.exports = (client) => {
    client.on("messageUpdate", async (oldMsg, newMsg) => {
        if (!newMsg.guild || !!newMsg.content || newMsg.content == null) return; // STOP IGNORING THIS YOU DUMB EVENT, YOU'RE SUPPOSED TO RETURN IF IT'S NULL!
        let chName = newMsg.channel.name;
        if (newMsg.guild.id == c2sID) {
            let msg = newMsg.content.toLowerCase(), suggestionArray = ["suggestion:", "suggest:", `${prefix}suggestion`, `${prefix}suggest`],
                suggestionRegex = new RegExp(`(?:${prefix})?suggest(?:ions|ion)?:?`, 'i');
            if (chName == 'suggestions') {
                if (suggestionRegex.exec(msg) != null || getPermissionLevel(newMsg.member) > 0) return;
                else {
                    newMsg.delete();
                    let embed = new MessageEmbed()
                        .setTitle("Your Suggestion")
                        .setDescription(`\`${newMsg.content}\``);
                    newMsg.author.send(`Your message in ${newMsg.channel} was deleted due to not having the `+
                            `suggestion-prefix required with suggestions, which means your message `+
                            `*must* start with ${suggestionArray.map(t => `\`${t}\``).join(', ')}. The `+
                            `reason for the required suggestion-prefixes is to prevent the channel `+
                            `getting messy due to conversations instead of actual suggestions.`, embed);
                }
            }
        }
    });
}