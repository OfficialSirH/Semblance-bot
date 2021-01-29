const { MessageEmbed } = require('discord.js'),
    randomColor = require('../constants/colorRandomizer.js'),
    Afk = require('../models/Afk.js'),
    { sembID } = require('../config');

module.exports = {
    dontDisturb: dontDisturb,
    removeAfk: removeAfk,
    permissionRequired: 0
}

module.exports.run = async (client, interaction) => {
	let reason = (!!interaction.data.options) ? interaction.data.options[0].value : "Just because";
    let user = interaction.member.user;
    let afkHandler = await Afk.findOne({ userID: user.id });
	if (afkHandler == null) {
		afkHandler = new Afk({ userID: user.id, reason: reason });
		await afkHandler.save();
	} else afkHandler = await Afk.findOneAndUpdate({ userID: user.id }, { $set: { reason: reason } }, { new: true });
	
	let embed = new MessageEmbed()
		.setTitle("AFK")
		.setColor(randomColor())
		.setDescription(`You are now afk <@${user.id}> \n` +
            `Reason: ${reason}`);
    embed = embed.toJSON();
    return [{ embeds: [embed] }];
}

async function dontDisturb(client, message, mentioned) {
    mentioned.forEach(async (user) => {
        if (message.author.id != user.id) {
            let afkHandler = await Afk.findOne({ userID: user.id });
            if (afkHandler != null) {
                let reason = afkHandler.reason;
                let embed = new MessageEmbed()
                    .setTitle("Currently Afk")
                    .setColor(randomColor())
                    .setThumbnail(user.displayAvatarURL())
                    .setDescription(`${user.tag} is currently afk`)
                    .addField("Reason", `${reason}`);
                return message.reply(embed);
            }
        }
    });
}

async function removeAfk(client, message, user) {
    if (message.author.id == sembID) return;
    let afkHandler = await Afk.findOne({ userID: message.author.id });
    if (afkHandler == null) return;
    afkHandler = await Afk.findOneAndDelete({ userID: message.author.id });
    message.reply("You are no longer AFK");
}