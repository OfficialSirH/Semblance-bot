const { MessageEmbed, MessageAttachment, Collection } = require('discord.js'),
	fs = require("fs"),
	randomColor = require("../constants/colorRandomizer.js"),
	{ sembID } = require('../config.js');
let afkListData = new Collection();
let afkList = [];
let reasonList = [];

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
		let reason = (reasonArray.length > 0) ? reasonArray.join(" "):"Just because";
	if (!afkListData.has(message.author.id) || !afkListData.get(message.author.id).afk) afkListData.set(message.author.id, {
		afk: true,
		afkReason: reason
	});
		let embed = new MessageEmbed()
		.setTitle("AFK")
		.setColor(randomColor())
		.setDescription(`You are now afk ${message.author} \n`+
						`Reason: ${reason}`);
		message.channel.send(embed);
}


	async function dontDisturb(client, message, mentioned) {
		mentioned.forEach( user => {
			if(afkListData.has(user.id) && afkListData.get(user.id).afk && message.author.id != user.id) {
				let reason = afkListData.get(user.id).afkReason;
				let embed = new MessageEmbed()
					.setTitle("Currently Afk")
					.setColor(randomColor())
					.setThumbnail(user.avatarURL())
					.setDescription(`${user.tag} is currently afk`)
					.addField("Reason", `${reason}`);
				message.reply(embed);
			}
		});
	}

	async function removeAfk(client, message, user) {
		if (message.author.id == sembID) return;
		if (!afkListData.has(user)) return;
		if (afkListData.get(user).afk == false) return;
		afkListData.delete(user);
		message.reply("You are no longer AFK");
	}
