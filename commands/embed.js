const { MessageEmbed, MessageAttachment } = require('discord.js');
const randomColor = require("../constants/colorRandomizer.js");
let embeddingUser = [];
let sembMessages = [];
let embedList = [];

module.exports = {
	description: "Create an embedded message with this command",
	usage: {
		"<setup or help>": "Specify whether you want to setup an embed or see the help for embed creation."
	},
	permissionRequired: 1,
	checkArgs: (args) => args.length >= 1,
	embedCreate: embedCreate
}

module.exports.run = async (client, message, args) => {
	if (args[0] == "help") return embedCreationHelp(message);
	if (args[0] == "setup") return embedSetup(client, message);
}

	async function embedSetup(client, message) {
		let inList = false;
		for (let i = 0; i < embeddingUser.length; i++) {
			if (embeddingUser[i] == message.author.id) {
				inList = true;
			}
		}
		if (!inList) {
			embeddingUser.push(message.author.id);
			message.reply("What would you like the title of your embed to be?")
				.then(thisThing => { sembMessages.push(thisThing);});
		}
	}

	async function embedCreate(client, message) {
		let msg = message.content;
		let inList = false;
		let arrayPos;
		for (let i = 0; i < embeddingUser.length; i++) {
			if (embeddingUser[i] == message.author.id) {
				inList = true;
				arrayPos = i;
				if (sembMessages[arrayPos].channel.id != message.channel.id) {
					return;
                }
				message.delete();
            }
		}
		if (!inList) return;
		if (message.content == "cancel embed") {
			embeddingUser.splice(arrayPos, 1);
			try {
				sembMessages[arrayPos].delete();
			} catch (err) {console.log("Message had trouble deleting")}
			sembMessages.splice(arrayPos, 1);
			embedList.splice(arrayPos, 1);
			message.reply("Embed has been cancelled. This message will delete in 5 seconds.")
				.then(thisThing => { thisThing.delete({ timeout: 5000 }) })
				.catch(console.log("Something didn't work"));
			return;
		}
		let embedEdit = embedList[arrayPos];
		if (!embedEdit) {
			for (let i = 0; i < arrayPos+1 - embedList.length; i++) {
				embedList.push([]);
            }
		}
		embedEdit = embedList[arrayPos];
		if (msg == ":finish") {
			try { sembMessages[arrayPos].delete(); } catch (err) { console.log(err); }
			sendEmbed(message, embedEdit, arrayPos);
			return;
		}
		if (embedEdit.length == 0) {
			embedEdit.push(msg);
			sembMessages[arrayPos].edit("What would you like your author text to be? type in 'null' if you don't want an author, also, adding :me or :server will use the avatar/icon of those.");
		} else if (embedEdit.length == 1) {
			if (msg == "null") {
				embedEdit.push(msg);
				sembMessages[arrayPos].edit("What would you like your thumbnail to be? type 'null' for none, 'me' for your avatar, 'server' for the server icon, or use a (Valid!) link.");
				return;
			}
			let authorIcon;
			if (msg.indexOf(":me") >= 0) {
				authorIcon = message.author.avatarURL();
				msg = msg.replace(/:me/, "");
			} else if (msg.indexOf(":server") >= 0) {
				authorIcon = message.guild.iconURL();
				msg = msg.replace(/:server/, "");
			}
			if (authorIcon != undefined) {
				embedEdit.push([msg, authorIcon]);
			} else {
				embedEdit.push(msg);
			}
			sembMessages[arrayPos].edit("What would you like your thumbnail to be? type 'null' for none, 'me' for your avatar, 'server' for the server icon, or use a (Valid!) link.");
		} else if (embedEdit.length == 2) {
			if (msg == 'null') {
				embedEdit.push(msg);
				sembMessages[arrayPos].edit("Now what would you like your description to say? type 'null' to skip and Remember to keep the message at 2048 characters or less.");
				return;
			}
			if (msg == "me") {
				embedEdit.push(message.author.avatarURL());
			} else if (msg == "server") {
				embedEdit.push(message.guild.iconURL());
			} else if (msg.indexOf("https") == 0) {
				embedEdit.push(msg);
			} else {
				sembMessages[arrayPos].edit("Your input for thumbnail was invalid, please type 'me', 'server', or an image link. Type 'null' to skip.");
				return;
			}
			sembMessages[arrayPos].edit("Now what would you like your description to say? type 'null' to skip and Remember to keep the message at 2048 characters or less.");
		} else if (embedEdit.length == 3) {
			if (msg == "null") {
				embedEdit.push(msg);
				sembMessages[arrayPos].edit("Color? Use 'random', #123456 with a range of a-f, or without # as well. skip with 'null'.");
				return;
			}
			if (msg.length > 2048) {
				sembMessages[arrayPos].edit("Your description is too large, please keep it under 2048 characters.");
				return;
			}
			embedEdit.push(msg);
			sembMessages[arrayPos].edit("Color? Use 'random', #123456 with a range of a-f, or without # as well. skip with 'null'.");
		} else if (embedEdit.length == 4) {
			if (msg == 'null') {
				embedEdit.push(msg);
				sembMessages[arrayPos].edit("Image? use 'me', 'server', or use an image link. type 'null' to skip.");
				return;
			}
			if (msg == 'random') {
				embedEdit.push(randomColor());
			} else if (msg.length == 7 && msg.indexOf("#") == 0) {
				embedEdit.push(msg);
			} else if (msg.length == 6) {
				embedEdit.push(`#${msg}`);
			} else {
				sembMessages[arrayPos].edit("Your input for color was invalid, use 'random', #123456 with a range of a-f, or without # as well. If you don't want a color, use 'null'.");
				return;
			}
			sembMessages[arrayPos].edit("Image? use 'me', 'server', or use an image link. type 'null' to skip.");
		} else if (embedEdit.length == 5) {
			if (msg == 'null') {
				embedEdit.push(msg);
				sembMessages[arrayPos].edit("Footer? If you'd like an icon in footer, use :me or :server with your text. Type 'null' to skip");
				return;
			} else if (msg == "me") {
				embedEdit.push(message.author.avatarURL());
			} else if (msg == "server") {
				embedEdit.push(message.guild.iconURL());
			} else if (msg.indexOf("https") == 0) {
				embedEdit.push(msg);
			} else {
				sembMessages[arrayPos].edit("Your input for Image was invalid, use 'me', 'server', or an image link. type 'null' to skip.");
			}
			sembMessages[arrayPos].edit("Footer? If you'd like an icon in footer, use :me or :server with your text. type 'null' to skip.");
		} else if (embedEdit.length == 6) {
			if (msg == 'null') {
				embedEdit.push(msg);
				sembMessages[arrayPos].edit("Attachments? Send an attachment(s) or type 'null' to skip.");
				return;
			} else if (msg.indexOf(":me") >= 0) {
				msg = msg.replace(/:me/, "");
				embedEdit.push([msg, message.author.avatarURL()]);
			} else if (msg.indexOf(":server") >= 0) {
				msg = msg.replace(/:server/, "");
				embedEdit.push([msg, message.guild.iconURL()]);
			} else {
				embedEdit.push(msg);
			}
			sembMessages[arrayPos].edit("Attachments? Send an attachment(s) or type 'null' to skip.");
		} else if (embedEdit.length == 7) {
			if (msg == 'null') {
				embedEdit.push(msg);
				sembMessages[arrayPos].edit("What would you like the title of your first field to be? type 'null' to skip");
				return;
			} else if (message.attachments.size > 0) {
				let attachmentList = [];
				message.attachments.forEach(attachment => {
					attachmentList.push(attachment);
				});
				embedEdit.push(attachmentList);
			} else {
				sembMessages[arrayPos].edit("Your input for attachments was invalid, send an attachment or type 'null' to skip");
				return;
			}
			sembMessages[arrayPos].edit("What would you like the title of your first field to be? type 'null' to skip.");
		} else if (embedEdit.length == 8) {
			if (msg == 'null') {
				embedEdit.push(msg);
				try { sembMessages[arrayPos].delete(); } catch (err) { console.log(err) }
				sendEmbed(message, embedEdit, arrayPos);
				return;
			} else {
				embedEdit.push([1, msg]);
				sembMessages[arrayPos].edit("What would you like your Field description to be? type 'null' to skip.");
			}
		} else if (embedEdit.length == 9) {
			let fields = embedEdit[8];
			if (msg == 'null') {
				if (fields[0] == 2) {
					fields.push(false);
				} else {
					fields.push(msg);
				}
				try { sembMessages[arrayPos].delete(); } catch (err) { console.log(err) } 
				sendEmbed(message, embedEdit, arrayPos);
				return;
			} else if (fields[0] == 2) {
				if (msg == 'true' || msg == 't') {
					fields.push(true);
					sembMessages[arrayPos].edit("Next Field title? 'null' to skip.");
					fields[0] = 3;
				} else if (msg == 'false' || msg == 'f') {
					fields.push(false);
					sembMessages[arrayPos].edit("Next Field title? 'null' to skip.");
					fields[0] = 3;
				} else {
					sembMessages[arrayPos].edit("That's invalid for inline, you need to type 'true', 't', 'false', or 'f'.");
					return;
				}
			} else if (fields[0] == 3) {
				fields.push(msg);
				sembMessages[arrayPos].edit("Next Field description? 'null' to skip.");
				fields[0] = 1;
				return;
			} else {
				fields.push(msg);
				sembMessages[arrayPos].edit("Next Field Inline?(t or f)");
				fields[0] = 2;
				return;
			}
			if (fields.length == 24) {
				try {
					sembMessages[arrayPos].edit("You have reached the max amount of fields.")
						.then(() => message.delete({ timeout: 3000 }))
						.catch(console.error);
				} catch (err) { console.log(err) } 
            }
        }
	}

	async function embedCreationHelp(message) {
		if (!message.member.hasPermission("MANAGE_MESSAGES")) {
			message.reply("You don't have enough permission to use this command. Required Perms: Manage Messages");
			return;
		}
		let embed = new MessageEmbed()
			.setTitle("Embed Creation Help")
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setColor(randomColor())
			.setImage("https://i.imgur.com/p5BOm9N.png")
			.setDescription("The embed creator is simple, you just start with s!embed and just follow what Semblance tells you. " +
				"If you type :finish in the middle of the steps, it will automatically finish the embed with what you've completed, " +
				"Typing :me with your message(or without message) during the footer, author, thumbnail, or image will set it to your profile; " +
				"same goes for :server, which will set all of the given examples with your server icon instead. Typing 'cancel embed' will cancel the embed " +
				"and typing 'null' will skip the current step.")
			.setFooter(`Called by ${message.author.tag}`);
		message.channel.send(embed);
    }

	async function sendEmbed(message, embedInput, arrayPos) {
		embeddingUser.splice(arrayPos, 1);
		sembMessages.splice(arrayPos, 1);
		embedList.splice(arrayPos, 1);

		let embed = new MessageEmbed();
		if (embedInput[0] != "null" && embedInput[0]) embed.setTitle(embedInput[0]);
		if (embedInput[1] != 'null' && embedInput[1]) {
			if (Array.isArray(embedInput[1])) {
				let authorArray = embedInput[1];
				embed.setAuthor(authorArray[0], authorArray[1]);
			} else {
				embed.setAuthor(embedInput[1]);
			}
		}
		try { if (embedInput[2] != 'null' && embedInput[2]) embed.setThumbnail(embedInput[2]); } catch (err) {
			message.reply("There seems to be a problem with your thumbnail, sorry for the inconvenience.");
			return;
		}
		if (embedInput[3] != 'null' && embedInput[3]) embed.setDescription(embedInput[3]);
		try { if (embedInput[4] != 'null' && embedInput[4]) embed.setColor(embedInput[4]); } catch (err) {
			message.reply("There seems to be a problem with your color, sorry for the inconvenience.");
			return;
		}
		try { if (embedInput[5] != 'null' && embedInput[5]) embed.setImage(embedInput[5]); } catch (err) {
			message.reply("There seems to be a problem with your image, sorry for the inconvenience.");
			return;
		}
		if (embedInput[6] != 'null' && embedInput[6]) {
			if (Array.isArray(embedInput[6])) {
				let footerArray = embedInput[6];
				embed.setFooter(footerArray[0], footerArray[1]);
			} else {
				embed.setFooter(embedInput[6]);
			}
		}
		if (embedInput[7] != 'null' && embedInput[7]) {
			embed.attachFiles(embedInput[7]);
		}
		if (embedInput[8] != 'null' && embedInput[8]) {
			let fieldsRaw = embedInput[8];
			fieldsRaw.shift();
			let fieldArray = [];
			if (fieldsRaw[fieldsRaw.length - 1] == 'null') fieldsRaw.splice(fieldsRaw.length - 1, 1);
			let looper = Math.ceil(fieldsRaw.length / 3);
			for (let i = 0; i < looper; i++) {
				let field = fieldsRaw.slice(0, 2);
				fieldsRaw.splice(0, 3);
				fieldArray.push({
					name: field[0],
					value: field[1],
					inline: field[2]
				});
			}
			try {
				fieldArray.forEach(array => {
					if (array.name && array.value && array.inline) embed.addField(array.name, array.value, array.inline);
					if (array.name && array.value && !array.inline) embed.addField(array.name, array.value, false);
					if (array.name && !array.value && !array.inline) embed.addField(array.name, "", false);
				});
			} catch (error) { message.channel.send("Something went wrong with the fields, sorry.");}
		}
		message.channel.send(embed);
	}