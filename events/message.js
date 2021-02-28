const { sembID, sirhID, prefix, c2sID, sirhGuildID, lunchGuildID, ignoredGuilds } = require('../config.js'),
    { getPermissionLevel, parseArgs } = require('../constants'), { Collection, MessageEmbed } = require('discord.js'),
    { embedCreate } = require('../commands/embed.js'),
	{ reactionToRole } = require('../commands/rolereact.js'),
	{ dontDisturb, removeAfk } = require('../commands/afk.js'),
    { Information } = require('../commands/edit.js')


/*
 * Check for GitHub updates
 */

async function checkForGitHubUpdate(message) {
	if (message.channel.name == 'semblance-updates' && message.guild.id == sirhGuildID && message.author.username == 'GitHub') {
		let infoHandler = await Information.findOneAndUpdate({ infoType: "github" }, { $set: { info: message.embeds[0].description.substring(message.embeds[0].description.indexOf(')') + 2), updated: true } }, { new: true });
		return true;
	}
	return false;
}

/*
 * Blacklisted word filtering
 */

let warnings = new Collection();

function clearBlacklistedWord(message, member) {
	if (message.guild.id != c2sID && message.guild.id != sirhGuildID) return;
	let msg = message.content.toLowerCase();
	if (msg.indexOf('nigger') >= 0 || msg.indexOf('nigga') >= 0) {
		if (member.user.bot) return;
		message.delete();
		let modLog = message.guild.channels.cache.find(c => (c.name == 'mod-log' || c.name == 'mod-logs'));
		let userWarnings = warnings.get(member.id);
		if (userWarnings) warnings.set(member.id, userWarnings + 1);
		else warnings.set(member.id, 1);
		if (warnings.get(member.id) === 3) return member.ban({ days: 7, reason: "Used the n-word multiple times" }).then(modLog.send(new MessageEmbed().setDescription(`${member.user.tag} has been banned for using the n-word multiple times.`)));
		if (modLog) return modLog.send(new MessageEmbed().setDescription(`${member.user.tag} used the n-word and has been warned.\n message: ${message.content}`)).then(member.user.send(`This is a warning for using an explicit word, continuing this behavior may/will result in a ban. If you received this warning despite not actually using the explicit word (the n-word), please notify SirH#4297, else, please stop using the word.`));
	}
}

async function updateBeyondCount() {
	const beyondCount = await Information.findOne({ infoType: 'beyondcount' });
	await Information.findOneAndUpdate({ infoType: 'beyondcount' }, { $set: { count: ++beyondCount.count } }, { new: true });
}

module.exports = (client) => {
    client.on("message", async message => {
        checkForGitHubUpdate(message);
	if (message.channel.name == "cells-tweets" && message.guild.id == c2sID && message.author.id != sembID && !message.member.roles.cache.get('493796775132528640')) return message.delete();
	if (message.channel.type == "dm" || message.author.bot || ignoredGuilds.includes(message.guild.id)) return;
	if (message.member) {
		if (message.mentions.users && message.member.id != sembID) {
			dontDisturb(client, message, message.mentions.users);
		}
	}

    const { commands, aliases, autoCommands } = client;

	if (!message.content.startsWith(`${prefix}afk `) && (!message.content.startsWith('</afk:813628842182311976>') || message.application == null)) removeAfk(client, message, message.author.id);
	//Cell to Singularity Exclusive Code
	let chName = message.channel.name;
	for (const [key, value] of Object.entries(autoCommands)) autoCommands[key].run(client, message, parseArgs(message.content));
	if (message.guild.id == c2sID) {
		clearBlacklistedWord(message, message.member);
		let msg = message.content.toLowerCase(), suggestionArray = ["suggestion:", "suggest:", `${prefix}suggestion`, `${prefix}suggest`],
			suggestionRegex = new RegExp(`(?:${prefix})?suggest(?:ions|ion)?:?`, 'i');
		
		if (msg.includes('beyond') && !msg.includes('s!beyond')) updateBeyondCount();

		if (chName == 'suggestions') {
			if (suggestionRegex.exec(msg) != null || getPermissionLevel(message.member) > 0) return;
			else {
				message.delete();
				let embed = new MessageEmbed()
					.setTitle("Your Suggestion")
					.setDescription(`\`${message.content}\``);
				message.author.send(`Your message in ${message.channel} was deleted due to not having the ` +
					`suggestion-prefix required with suggestions, which means your message ` +
					`*must* start with ${suggestionArray.map(t => `\`${t}\``).join(', ')}. The ` +
					`reason for the required suggestion-prefixes is to prevent the channel ` +
					`getting messy due to conversations instead of actual suggestions.`, embed);
			}
		}
		if (chName == 'share-your-prestige' && message.attachments.size == 0 && getPermissionLevel(message.member) == 0) message.delete();
		if (chName != 'semblance' && chName != 'mod-chat' && getPermissionLevel(message.member) == 0) return;
	}
	if (message.guild.id == sirhGuildID) {
		if (chName != 'bot-room' && getPermissionLevel(message.member) == 0) return;
	}
	//End of Cell to Singularity Exclusive Code
	if (message.mentions) {
		let msgMention = message.content.replace(/!/g, "");
		if ((msgMention == `<@${client.user.id}> ` || msgMention == `<@${client.user.id}>`) && message.member.id != sembID) {
			message.reply("My command prefix is s!, which you can start off with s!help for all of my commands. :D");
			return;
		}
	}
	embedCreate(client, message);
	
	//commands start here
	if (message.content.toLowerCase().startsWith(prefix) || message.content.match(`^<@!?${client.user.id}> `)) {
		let content = message.content.split(" ")
		if (content[0].match(`^<@!?${client.user.id}>`)) content.shift(); else content = message.content.slice(prefix.length).split(" ")
		const identifier = content.shift().toLowerCase(), command = aliases[identifier] || identifier;
		content = content.join(" ")

		const commandFile = commands[command]
		if (commandFile) {
			let permissionLevel;
			const args = parseArgs(content); try { permissionLevel = getPermissionLevel(message.member);
			} catch (e) { permissionLevel = (message.author.id == sirhID) ? 7 : 0 }
			//console.log(`${message.member}: ${permissionLevel}`);
			try { if (permissionLevel < commandFile.permissionRequired) return message.channel.send("❌ You don't have permission to do this!");
				if (!commandFile.checkArgs(args, permissionLevel, content)) return message.channel.send(`❌ Invalid arguments! Usage is \`${prefix}${command}${Object.keys(commandFile.usage).map(a => " " + a).join("")}\`, for additional help, see \`${prefix}help\`.`)
				commandFile.run(client, message, args, identifier, { permissionLevel, content });
				client.increaseCommandCount();
			} catch (e) { }
		}
	}

	if (message.content.substring(0, prefix.length).toLowerCase() == prefix) {
        let args = message.content.substring(prefix.length).split(' ');
        let cmd = args[0].toLowerCase();
		console.log(cmd + " Called by " + message.author.username + " in " + message.guild.name);
       
        args = args.splice(1);
		let msgs = message.content;
		switch (cmd) {
			case 'ping':
				message.channel.send(`Pinging me gets you pinged, <@${message.author.id}> :D`);
				break;
			default:
        }
    }
    });
}