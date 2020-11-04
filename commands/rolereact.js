var reactionData = [];
const { MessageEmbed } = require('discord.js');

module.exports = {
    description: "Create a role reaction message easily with this.",
    usage: {
        "<emoji> <role> <msg>": "create the role message with this."
    },
    permissionRequired: 2,
    checkArgs: (args) => args.length >= 3,
    reactionToRole: reactionToRole
}

module.exports.run = async (client, message, args) => {
    return message.reply("This command has been disabled temporarily due to many problems with it currently, this will be fixed soon.");
    var emoji = args[0];
    var role = args[1];
    var reactMessage = args.slice(2, args.length).join(" ");
        var reactMsg;
        var emojiReaction = emoji.replace(/:/g, "");
        var mainRole = message.guild.roles.cache.get(role.replace(/<@&/, "").replace(/>/, ""));
        var data = findReactionData(mainRole, false);
        var embed = new MessageEmbed()
            .setTitle("React Me")
            .setThumbnail(client.user.avatarURL())
            .setDescription(reactMessage);
            Promise.resolve(message.channel.send(embed))
                .then(function(msg) {
                    data[0] = msg;
                    msg.react(emoji)
                        .catch(console.error);
                })
                .catch(console.error);
            data[1] = emojiReaction;
            data[2] = mainRole;
}

    async function reactionToRole(reaction, user, reacted) {
        if (reactionData.length == 0) return;
        var data = findReactionData(false, reaction.message.id);
        if (!data) return;
        if (reaction.emoji.name == data[1] && reaction.message.id == data[0].id) {
            var role = reaction.message.guild.roles.cache.find(r => r.name === data[2].name);
            var member = reaction.message.guild.members.cache.get(user.id);
            if (reacted) {
                console.log('reacted');
                member.roles.add(role, "Reacted to autoRole Message.");
            } else {
                console.log('unreacted');
                member.roles.remove(role, "Unreacted to autoRole Message.");
            }
        }
    }


async function findReactionData(role, message) {
    if (role) {
        reactionData.forEach((data, index) => {
            if (data[2] == role) {
                data[0].delete()
                    .catch(console.error);
                return data;
            }
        });
        reactionData.push([]);
        var data = reactionData[reactionData.length - 1];
        for (var i = 0; i < 2; i++) data.push([]);
        data.push(role);
        return data;
    } else {
        var yes = false;
        var item;
        reactionData.forEach((data, index) => {
            if (data[0].id == message) {
                yes = true;
                item = data;
            }
        });
        if (yes) {
            return item;
        } else {
            return false;
        }
    }
}
