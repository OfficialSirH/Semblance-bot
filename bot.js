/*
 * Constants
 */
// Configuration
const { sembID, sirhID, prefix, currentLogo, c2sID, sirhGuildID, lunchGuildID, ignoredGuilds } = require('./config.js'),
	wait = require('util').promisify(setTimeout);

const { Client, MessageEmbed, MessageAttachment, GuildEmoji, Collection, Permissions } = require('discord.js'), 
	constants = require("./constants"), { getPermissionLevel, parseArgs, getAvatar } = constants,
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
const Twitter = require("twitter"), twClient = new Twitter(JSON.parse(process.env.twitter)),
	fetch = require("node-fetch"),
	fs = require('fs'),
	{ embedCreate } = require('./commands/embed.js'),
	{ reactionToRole } = require('./commands/rolereact.js'),
	{ dontDisturb, removeAfk } = require('./commands/afk.js'),
	{ TurnPage } = require('./commands/gametransfer.js');
//keep bot active
const stayActive = require('./stayActive.js');

/*
 * Command setup
 */

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
let topGG;
let discordBoats;

/*
 * Twitter implementation
 * @Return Promise<MagicalTwitterPost>
 */

let current_id = null, screen_name = "ComputerLunch";

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
  if (tweet.id_str !== current_id && current_id) {
	  fetch(process.env.C2SWebhook, {
		  method: "POST",
		  headers: {
			  "Content-Type": "application/json"
		  },
		  body: JSON.stringify({
			  content: `Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}`
		  })
	  });
	  let guild = client.guilds.cache.get(c2sID), channel = guild.channels.cache.find(c => c.name == "cells-tweets");
	  channel.send(`Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}`);

	  guild = client.guilds.cache.get(lunchGuildID), channel = guild.channels.cache.find(c => c.name == 'tweets');
	  channel.send(`Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}`);
  }
  } catch (error) {}
  current_id = tweet.id_str;
})

setInterval(checkTweet, 2000);

/*
 * The start of the bot client
 */

const slashCommands = {}; 

const { Information } = require('./commands/edit.js'),
	{ GameModel } = require('./commands/game.js'),
	Votes = require('./models/Votes.js');

client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
	setTimeout(function () {
		topGG = require("./commands/websiteScripts/topGG.js");
		topGG.FixClient(client);
		discordBoats = require("./commands/websiteScripts/DiscordBoat.js");
		discordBoats(client);
	}, 500);
	ShowMyActivity();

	/*
	 Exclusively cache any users from the game and vote database that aren't already cached
	 */
	const cacheList = await Information.findOne({ infoType: 'cacheList' });
	let newCachedUsers = [];
	const gameList = await GameModel.find({});
	gameList.forEach(userData => {
		if (!cacheList.list.includes(userData.player)) newCachedUsers.push(userData.player);
	});
	const voteList = await Votes.find({});
	voteList.forEach(voteData => {
		if (!cacheList.list.includes(voteData.user)) newCachedUsers.push(voteData.user);
	});
	let newCacheList = [...cacheList.list, ...newCachedUsers];
	let updatedCacheList = await Information.findOneAndUpdate({ infoType: 'cacheList' }, { $set: { list: newCacheList } }, { new: true });
	console.log(`The cache list has gained ${newCachedUsers.length}, which now makes the cache list have a total of ${updatedCacheList.list.length}.`);

	client.sweepUsers = async () => {
		let cacheList = await Information.findOne({ infoType: 'cacheList' });
		let now = new Date();
		let cacheLifetime = 30000;
		let users = 0;
		users += client.users.cache.sweep(user => { 
			if (cacheList.list.includes(user.id)) return false;
			let channel = client.channels.cache.get(user.lastMessageChannelID);
			if (!channel || !channel.messages) return true;
			let lastMessage = channel.messages.cache.get(user.lastMessageID);
			if (!lastMessage) return true;
			return (now - (lastMessage.editedTimestamp || lastMessage.createdTimestamp)) > cacheLifetime;
		});
		client.guilds.cache.map(g => g.members.cache).forEach(members => {
			users += members.sweep(member => {
				let channel = client.channels.cache.get(member.lastMessageChannelID);
				if (!channel || !channel.messages) return true;
				let lastMessage = channel.messages.cache.get(member.lastMessageID);
				if (!lastMessage) return true;
				return (now - (lastMessage.editedTimestamp || lastMessage.createdTimestamp)) > cacheLifetime;
			});
		});
		return users;
	}
	client.clearCache = setInterval(() => {
		client.sweepUsers();
	}, 30000);

	/* Slash Command setup */
	let slash_commands = await client.api.applications(client.user.id).commands.get();
    slash_commands.forEach(command => slashCommands[command.id] = require(`./slash_commands/${command.name}.js`));

	/*
	* Reminder check
	*/

	setInterval(() => { commands['remindme'].checkReminders(client) }, 60000);

	Information.findOne({ infoType: "github" })
		.then(async (infoHandler) => {
			if (infoHandler.updated) {
				await Information.findOneAndUpdate({ infoType: "github" }, { $set: { updated: false } }, { new: true });
				let embed = new MessageEmbed()
					.setTitle("Semblance Update")
					.setColor(randomColor())
					.setAuthor(client.user.tag, client.user.displayAvatarURL())
					.setDescription(`**${infoHandler.info}**`);

				client.guilds.cache.get(c2sID).channels.cache.find(c => c.name == 'semblance').send(embed);
			}
		});
	//await CommandCounter.deleteMany({});
	await commands['game'].updateLeaderboard(client);
	await commands['leaderboard'].updateLeaderboard(client);
});

/*
	Slash Command interactions
*/
async function send(interaction, { content = null, embeds = [], type = 4, flags = 0 } = {}) {
    client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: type,
        data: {
            content: content,
            embeds: embeds,
            flags: flags
        }
    }})
}

client.ws.on('INTERACTION_CREATE', async interaction => {

    const command = slashCommands[interaction.data.id];
    if (!!command) {
        let guild = client.guilds.cache.get(interaction.guild_id),
            member = await guild.members.fetch(interaction.member.user.id),
            permissionLevel = await getPermissionLevel(member),
            channel = guild.channels.cache.get(interaction.channel_id);
        console.log(`${member.user.tag} : ${permissionLevel}`);
        if ((guild.id == c2sID && channel.name != 'semblance' && permissionLevel == 0) || permissionLevel < command.permissionRequired) 
            return send(interaction, { content: 'Ah ah ah! You didn\'t say the magic word!'/*'You don\'t have permission to use this slash command.'*/, flags: 1 << 6, type: 3 });
        
        interaction.member.user.tag = `${interaction.member.user.username}#${interaction.member.user.discriminator}`;
        interaction.member.user.avatarURL = getAvatar(interaction.member.user);
        let result = await command.run(client, interaction, { permissionLevel, options: interaction.data.options });
        return send(interaction, ...result);
    }

    console.log(`${interaction.data.name}\n${interaction.data.id}`);
    //send(interaction, { content: `${interaction.data.id}\n${interaction.data.name}` });
});

/*
 * Setup for alternating activity
 */

const myActivity = setInterval(ShowMyActivity, 30000);
let alternateActivity = false;
let totalCommandsUsed = 0;

async function ShowMyActivity() {
	if (!alternateActivity) {
		client.user.setActivity(`s!help in ${client.guilds.cache.size} servers | ${totalCommandsUsed} commands used during uptime`, { type: "PLAYING" });
		alternateActivity = true;
	} else {
		alternateActivity = false;
		let totalMembers = client.guilds.cache.map(g => g.memberCount).filter(g => g).reduce((total, cur, ind) => total += cur, 0);
		client.user.setActivity(`s!help in ${client.guilds.cache.size} servers | ${totalMembers} members`, { type: "PLAYING" });
    }
}

/*
 * Bot login and MongoDB connection
 */

(async () => {
	await connect(process.env.mongoDBKey, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	});
	return client.login(process.env.token);
})()

/*
 * Message updates
 */

client.on('messageUpdate', (oldMsg, newMsg) => {
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

/*
 * Where the main magic happens, the message event
 */

client.on('message', message => {
	checkForGitHubUpdate(message);
	if (message.channel.name == "cells-tweets" && message.guild.id == c2sID && message.author.id != sembID && !message.member.roles.cache.get('493796775132528640')) return message.delete();
	if (message.channel.type == "dm" || message.author.bot || ignoredGuilds.includes(message.guild.id)) return;
	if (message.member) {
		if (message.mentions.users && message.member.id != sembID) {
			dontDisturb(client, message, message.mentions.users);
		}
	}

	if (!message.content.startsWith(`${prefix}afk `) && (!message.content.startsWith('</afk:804778881461911623>') || message.application == null)) removeAfk(client, message, message.author.id);
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
				totalCommandsUsed++;
			} catch (e) { }
		}
	}

	if (message.content.substring(0, prefix.length).toLowerCase() == prefix) {
        let args = message.content.substring(prefix.length).split(' ');
		//console.log(args);
        let cmd = args[0].toLowerCase();
		console.log(cmd + " Called by " + message.author.username + " in " + message.guild.name);
       
        args = args.splice(1);
		//console.log(args);
		let msgs = message.content;
		switch (cmd) {
			case 'ping':
				message.channel.send(`Pinging me gets you pinged, <@${message.author.id}> :D`);
				break;
			default:
         }
     }
	//commands end here
});

async function updateBeyondCount() {
	const beyondCount = await Information.findOne({ infoType: 'beyondcount' });
	await Information.findOneAndUpdate({ infoType: 'beyondcount' }, { $set: { count: ++beyondCount.count } }, { new: true });
}

const { reportChannelList, correctReportList, Report } = require('./commands/bug.js');

client.on('messageDelete', async message => {
	if (message.guild.id != c2sID || !reportChannelList.includes(message.channel.id)) return;
	await wait(3000);
	let report = await Report.findOne({ messageID: message.id });
	if (report) correctReportList(client, message, message.id);
});

/*
 * message reaction events
 */

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
