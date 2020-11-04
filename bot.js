const { Client, MessageEmbed, MessageAttachment, GuildEmoji, Collection } = require('discord.js'), 
	constants = require("./constants"), { getPermissionLevel, parseArgs } = constants,
	{ connect } = require('mongoose'),
	client = new Client({
		 disableMentions: "everyone",
    		messageCacheLifetime: 30,
    		messageSweepInterval: 300,
		partials: [ "USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION" ],
		ws: {
    	 	 	intents: [ "GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS" ]
    		}
	}), randomColor = require('./constants/colorRandomizer.js');
module.exports.client = client;
const Twitter = require("twitter"), twClient = new Twitter(JSON.parse(process.env.twitter));
const fetch = require("node-fetch");
const fs = require('fs');
const { sembID, sirhID, prefix, currentLogo, c2sID, sirhGuildID } = require('./config.js');
const { embedCreate } = require('./commands/embed.js'),
	{ reactionToRole } = require('./commands/rolereact.js'),
	{ dontDisturb, removeAfk } = require('./commands/afk.js'),
	{ TurnPage } = require('./commands/gametransfer.js');
//keep bot active
const stayActive = require('./stayActive.js'),
	twitch = require("./commands/twitch.js");

const commands = {}, aliases = {} // { "command": require("that_command") }, { "alias": "command" }
fs.readdir("./commands/", (err, files) => {
	if (err) return console.log(err);
	for (const file of files) if (file.endsWith(".js")) {
		const commandFile = require(`./commands/${file}`), fileName = file.replace(".js", "");
		commands[fileName] = commandFile;
		if (commandFile.aliases) for (const alias of commandFile.aliases) aliases[alias] = fileName;
	}
})

const autoCommands = {};
fs.readdir("./auto_scripts/", (err, files) => {
	if (err) return console.log(err);
	for (const file of files) if (file.endsWith(".js")) {
		const commandFile = require(`./auto_scripts/${file}`), fileName = file.replace(".js", "");
		autoCommands[fileName] = commandFile;
	}
})

//Voting API
var topGG;
var discordBoats;

//Twitch implementation
//setInterval( function() { twitch(client); }, 2000);

//Twitter implementation
let current_id = null, screen_name = "ComputerLunch", backup_id = null;

const checkTweet = () => twClient.get('statuses/user_timeline', {
  screen_name,
  exclude_replies: true,
  count: 1
}, async (error, tweets, response) => {
	if (error) {
		screen_name = "ComputerLunch";
		return console.log(error);
	}
  let tweet = tweets[0];
  try {
  if (tweet.id_str !== current_id && current_id && tweet.id_str !== backup_id && backup_id && screen_name == "ComputerLunch") {
	  fetch(process.env.C2SWebhook, {
		  method: "POST",
		  headers: {
			  "Content-Type": "application/json"
		  },
		  body: JSON.stringify({
			  content: `Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}`
		  })
	  });
	  var guild = client.guilds.cache.get(`488478892873744385`);
	  var channel = guild.channels.cache.find(c => c.name == "cells-tweets");
	  channel.send(`Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}`);
	backup_id = current_id;
  }
  } catch (error) {screen_name = "ComputerLunch"}
  current_id = tweet.id_str;
  if (screen_name == "ComputerLunch") {
  	  backup_id = current_id;
  }
})

setInterval(checkTweet, 2000);
//End of Twitter implementation

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	setTimeout(function () {
		topGG = require("./commands/websiteScripts/topGG.js");
		topGG.FixClient(client);
		discordBoats = require("./commands/websiteScripts/DiscordBoat.js");
		discordBoats(client);
	}, 500);
	ShowMyActivity();
	client.sweepUsers = () => {
		var now = new Date();
		var cacheLifetime = 30000;
		var users = 0;
     	users += client.users.cache.sweep(user => { 
			var channel = client.channels.cache.get(user.lastMessageChannelID);
			if (!channel || !channel.messages) return true;
			var lastMessage = channel.messages.cache.get(user.lastMessageID);
			if (!lastMessage) return true;
			return (now - (lastMessage.editedTimestamp || lastMessage.createdTimestamp)) > cacheLifetime;
		});
		client.guilds.cache.map(g => g.members.cache).forEach(members => {
			users += members.sweep(member => {
				var channel = client.channels.cache.get(member.lastMessageChannelID);
				if (!channel || !channel.messages) return true;
				var lastMessage = channel.messages.cache.get(member.lastMessageID);
				if (!lastMessage) return true;
				return (now - (lastMessage.editedTimestamp || lastMessage.createdTimestamp)) > cacheLifetime;
			});
		});
		return users;
	}
	client.clearCache = setInterval(() => {
		client.sweepUsers();
	}, 300);
});

var myActivity = setInterval(ShowMyActivity, 10000);
var alternateActivity = false;

async function ShowMyActivity() {
	var SirHActivity;
	var me = client.users.cache.get(sirhID);
	if (me == undefined) {
		return;
    }
	if (me.presence.activities.length <= 0) {
		SirHActivity = "Nothing at the moment";
	} else if (me.presence.activities[0].name != "Custom Status") {
		SirHActivity = me.presence.activities[0].name;
	} else {
		SirHActivity = me.presence.activities[0].state;
	}
	if (!alternateActivity) {
		client.user.setActivity(`s!help in ${client.guilds.cache.size} servers | SirH: ${SirHActivity}`, { type: "PLAYING" });
		alternateActivity = true;
	} else {
		alternateActivity = false;
		var totalUsers = 0;
		client.guilds.cache.forEach(guild => {
			totalUsers += guild.memberCount;
		});
		client.user.setActivity(`s!help in ${client.guilds.cache.size} servers | ${totalUsers} members`, { type: "PLAYING" });
    }
}

(async () => {
	await connect(process.env.mongoDBKey, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	});
	return client.login(process.env.token);
})()

client.on('messageUpdate', (oldMsg, newMsg) => {
	if (!newMsg.guild) return;
	var chName = newMsg.channel.name;
	if (newMsg.guild.id == c2sID) {
		var msg = newMsg.content.toLowerCase(), s1 = "suggestion:", s2 = "suggest:", s3 = `${prefix}suggestion`, s4 = `${prefix}suggest`;
		if (chName == 'suggestions') {
			if (msg.startsWith(s1) || msg.startsWith(s2) || msg.startsWith(s3) || msg.startsWith(s4) || getPermissionLevel(newMsg.member) > 0) return;
			else {
				newMsg.delete();
				var embed = new MessageEmbed()
					.setTitle("Your Suggestion")
					.setDescription(`\`${newMsg.content}\``);
				newMsg.author.send(`Your message in ${newMsg.channel} was deleted due to not having the `+
					      `suggestion-prefix required with suggestions, which means your message `+
					      `*must* start with \`${s1}\`, \`${s2}\`, \`${s3}\`, or \`${s4}\`. The `+
					      `reason for the required suggestion-prefixes is to prevent the channel `+
					      `getting messy due to conversations instead of actual suggestions.`, embed);
			}
		}
	}
});

async function checkForGitHubUpdate(message) {
	if (message.channel.name == 'semblance-updates' && message.guild.id == sirhGuildID && message.author.username == 'GitHub') {
		var embed = new MessageEmbed()
			.setTitle("Semblance Update")
			.setColor(randomColor())
			.setAuthor(client.user.tag, client.user.avatarURL())
			.setDescription(`**${message.embeds[0].description.substring(message.embeds[0].description.indexOf(')')+2)}**`);
		
		client.guilds.cache.get(c2sID).channels.cache.find(c => c.name == 'semblance').send(embed);
		return true;
	} 
	return false;
}

var warnings = new Collection();

function clearBlacklistedWord(message, member) {
	if (message.guild.id != c2sID && message.guild.id != sirhGuildID) return;
	var msg = message.content.toLowerCase();
	if (msg.indexOf('nigger') >= 0 || msg.indexOf('nigga') >= 0) {
		if (member.user.bot) return;
		message.delete();
		var modLog = message.guild.channels.cache.find(c => (c.name == 'mod-log' || c.name == 'mod-logs'));
		var userWarnings = warnings.get(member.id);
		if (userWarnings) warnings.set(member.id, userWarnings + 1);
		else warnings.set(member.id, 1);
		if (warnings.get(member.id) === 3) return member.ban({ days: 7, reason: "Used the n-word multiple times" }).then(modLog.send(new MessageEmbed().setDescription(`${member.user.tag} has been banned for using the n-word multiple times.`)));
		if (modLog) return modLog.send(new MessageEmbed().setDescription(`${member.user.tag} used the n-word and has been warned.\n message: ${message.content}`)).then(member.user.send(`This is a warning for using an explicit word, continuing this behavior may/will result in a ban. If you received this warning despite not actually using the explicit word (the n-word), please notify SirH#4297, else, please stop using the word.`));
	}
}

client.on('message', message => {
	checkForGitHubUpdate(message);
	if (message.channel.name == "cells-tweets" && message.guild.id == c2sID && message.author.id != sembID) return message.delete();
	if (message.channel.type == "dm" || message.author.bot) return;
	clearBlacklistedWord(message, message.member);
	if (message.member) {
		if (message.mentions.users && message.member.id != sembID) {
			dontDisturb(client, message, message.mentions.users);
		}
	}

	removeAfk(client, message, message.author.id);
	//Cell to Singularity Exclusive Code
	if (message.guild) {
		var chName = message.channel.name;
		if (message.guild.id == c2sID || message.guild.id == sirhGuildID) for (const [key, value] of Object.entries(autoCommands)) autoCommands[key].run(client, message, parseArgs(message.content));
		if (message.guild.id == c2sID) {
			var msg = message.content.toLowerCase(), s1 = "suggestion:", s2 = "suggest:", s3 = `${prefix}suggestion`, s4 = `${prefix}suggest`;
			if (chName == 'suggestions') {
				if (msg.startsWith(s1) || msg.startsWith(s2) || msg.startsWith(s3) || msg.startsWith(s4) || getPermissionLevel(message.member) > 0) return;
				else {
					message.delete();
					var embed = new MessageEmbed()
						.setTitle("Your Suggestion")
						.setDescription(`\`${message.content}\``);
					message.author.send(`Your message in ${message.channel} was deleted due to not having the `+
						      `suggestion-prefix required with suggestions, which means your message `+
						      `*must* start with \`${s1}\`, \`${s2}\`, \`${s3}\`, or \`${s4}\`. The `+
						      `reason for the required suggestion-prefixes is to prevent the channel `+
						      `getting messy due to conversations instead of actual suggestions.`, embed);
				}
			}
			if (chName == 'share-your-prestige' && message.attachments.size == 0 && getPermissionLevel(message.member) == 0) message.delete();
			if (chName != 'semblance' && chName != 'mod-chat' && getPermissionLevel(message.member) == 0) return;
		}
		if (message.guild.id == sirhGuildID) {
			if (chName != 'bot-room' && getPermissionLevel(message.member) == 0) return;
        	}
	}
	//End of Cell to Singularity Exclusive Code
	if (message.mentions) {
		var msgMention = message.content.replace(/!/g, "");
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
			var permissionLevel;
			const args = parseArgs(content); try { permissionLevel = getPermissionLevel(message.member);
			} catch (e) { permissionLevel = (message.author.id == sirhID) ? 7 : 0 }
			//console.log(`${message.member}: ${permissionLevel}`);
			try { if (permissionLevel < commandFile.permissionRequired) return message.channel.send("❌ You don't have permission to do this!");
				if (!commandFile.checkArgs(args, permissionLevel, content)) return message.channel.send(`❌ Invalid arguments! Usage is \`${prefix}${command}${Object.keys(commandFile.usage).map(a => " " + a).join("")}\`, for additional help, see \`${prefix}help\`.`)
				commandFile.run(client, message, args, identifier, { permissionLevel, content })
			} catch (e) { }
		}
	}

	if (message.content.substring(0, prefix.length).toLowerCase() == prefix) {
        var args = message.content.substring(prefix.length).split(' ');
		//console.log(args);
        var cmd = args[0].toLowerCase();
		console.log(cmd + " Called by " + message.author.username + " in " + message.guild.name);
       
        args = args.splice(1);
		//console.log(args);
		var msgs = message.content;
		switch (cmd) {
			case 'ping':
				message.channel.send(`Pinging me gets you pinged, <@${message.author.id}> :D`);
				break;
			case 'changestatus':
				message.delete();
				if (message.author.id != sirhID || args.length <= 0) return;
				clearInterval(myActivity);
				client.user.setActivity(`${prefix}help in ${client.guilds.cache.size} servers | SirH: ${args.join(" ")}`, { type: "PLAYING" });
				break;
			default:
         }
     }
	//commands end here
});

client.on("messageReactionAdd", (reaction, user) => {
	if(user.id != sembID) {
		TurnPage(client, reaction, user);
		reactionToRole(reaction, user, true);
	}
});

client.on("messageReactionRemove", (reaction, user) => {
	if (user.id != sembID) {
		reactionToRole(reaction, user, false);
	}
});
