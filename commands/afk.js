const { MessageEmbed, MessageAttachment, Collection } = require('discord.js'),
	fs = require("fs"),
	randomColor = require("../constants/colorRandomizer.js"),
	{ sembID } = require('../config.js'),
	Afk = require('../models/Afk.js');

module.exports = {
	description: "Set yourself afk so users know you're unavailable when they ping you.",
	usage: {
		"<reason>": "Provide your reason why you're afk, or don't and it'll default 'just because'."
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0,
	dontDisturb: dontDisturb,
	removeAfk: removeAfk
}

module.exports.run = async (client, message, reasonArray) => {
	if (message.author.id == sembID) return;
	let reason = (reasonArray.length > 0) ? reasonArray.join(" ") : "Just because";
	var afkHandler = await Afk.findOne({ userID: message.author.id });
	if (afkHandler == null) {
		afkHandler = new Afk({ userID: message.author.id, reason: reason });
		await afkHandler.save();
	} else afkHandler = await Afk.findOneAndUpdate({ userID: message.author.id }, { $set: { reason: reason } }, { new: true });
	
	let embed = new MessageEmbed()
		.setTitle("AFK")
		.setColor(randomColor())
		.setDescription(`You are now afk ${message.author} \n` +
			`Reason: ${reason}`);
	message.channel.send(embed);
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
