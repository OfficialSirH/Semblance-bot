import { Semblance } from "@semblance/src/structures";
import { GuildMember, Message, TextChannel, Collection, MessageEmbed, Constants } from "discord.js";
import config from '@semblance/config';
import { 
	getPermissionLevel,
	parseArgs,
	dontDisturb, 
	removeAfk 
} from '@semblance/constants';
import { promisify } from 'util';
import { messageDM } from './messageDM';
import { Information } from '@semblance/models';
const { Events } = Constants;
const { sirhId, prefix, c2sGuildId, sirhGuildId, lunchGuildId, ignoredGuilds } = config;
const wait = promisify(setTimeout);


export const messageCreate = (client: Semblance) => {
    client.on(Events.MESSAGE_CREATE, async message => {
        checkForGitHubUpdate(message);
	if (message.channel.type == 'dm') return messageDM(client, message) as unknown as void;
	if (message.author.bot || ignoredGuilds.includes(message.guild.id)) return;
	if (message.member) {
		if (message.mentions.users && message.member.id != client.user.id) {
			dontDisturb(message, message.mentions.users);
		}
	}

    const { commands, aliases, autoCommands } = client;

	if (!message.content.toLowerCase().startsWith(`${prefix}afk`) && (!message.content.startsWith('</afk:813628842182311976>') || message.applicationId == null)) removeAfk(client, message);
	//Cell to Singularity Exclusive Code
	let chName = message.channel.name;
	for (const [key, value] of Object.entries(autoCommands)) autoCommands[key].run(client, message, parseArgs(message.content));
	if (message.guild.id == c2sGuildId) {
		
		clearBlacklistedWord(message, message.member);
		let msg = message.content.toLowerCase(), suggestionArray = ["suggestion:", "suggest:", `${prefix}suggestion`, `${prefix}suggest`],
			suggestionRegex = new RegExp(`^(?:${prefix})?suggest(?:ions|ion)?:?`, 'i');
		
		if (msg.includes('beyond') && !msg.includes(`${prefix}beyond`)) updateBeyondCount();

		if (chName == 'suggestions') {
			if (suggestionRegex.exec(msg) != null || getPermissionLevel(message.member) > 0) return;
			else {
				message.delete();
				let embed = new MessageEmbed()
					.setTitle("Your Suggestion")
					.setDescription(`\`${message.content}\``);
				message.author.send({ content: `Your message in ${message.channel} was deleted due to not having the ` +
					`suggestion-prefix required with suggestions, which means your message ` +
					`*must* start with ${suggestionArray.map(t => `\`${t}\``).join(', ')}. The ` +
					`reason for the required suggestion-prefixes is to prevent the channel ` +
					`getting messy due to conversations instead of actual suggestions.`, embeds: [embed] });
			}
		}
		if (chName == 'share-your-prestige' && message.attachments.size == 0 && getPermissionLevel(message.member) == 0) message.delete();
		if (chName != 'semblance' && getPermissionLevel(message.member) == 0) return;
	}
	if (message.guild.id == sirhGuildId) {
		if (chName != 'bot-room' && chName != 'semblance-beta-testing' && getPermissionLevel(message.member) == 0) return;
	}
	//End of Cell to Singularity Exclusive Code
	if (message.mentions) {
		let msgMention = message.content.replace(/!/g, "");
		if ((msgMention == `<@${client.user.id}> ` || msgMention == `<@${client.user.id}>`) && message.member.id != client.user.id) {
			message.reply(`My command prefix is ${prefix}, which you can start off with ${prefix}help for all of my commands. :D`);
			return;
		}
	}
	
	//commands start here
	if (message.content.toLowerCase().startsWith(prefix) || message.content.match(`^<@!?${client.user.id}> `)) {
		let splitContent = message.content.split(" ")
		if (splitContent[0].match(`^<@!?${client.user.id}>`)) splitContent.shift(); else splitContent = message.content.slice(prefix.length).split(" ")
		const identifier = splitContent.shift().toLowerCase(), command = aliases[identifier] || identifier;
		let content = splitContent.join(" ")
		const commandFile = commands[command]
		
		if (commandFile) {
			if (commandFile.category == 'dm') { 
				message.reply('DM commands go in **DMs!**(DM = Direct Message)');
				console.log(`a dumbass(${message.author.tag}(${message.author.id})) just used the link command in the server.`);
				await wait(5000);
				if (message.member.roles.cache.has('718796622867464198')) return message.member.roles.remove('718796622867464198') as unknown as void;
				return;
			}
			let permissionLevel;
			const args = parseArgs(content); try { permissionLevel = getPermissionLevel(message.member);
			} catch (e) { permissionLevel = (message.author.id == sirhId) ? 7 : 0 }
			//console.log(`${message.member}: ${permissionLevel}`);
			try { if (permissionLevel < commandFile.permissionRequired) return message.channel.send("❌ You don't have permission to do this!") as unknown as void;
				if (!commandFile.checkArgs(args, permissionLevel, content)) return message.channel.send(`❌ Invalid arguments! Usage is \`${prefix}${command}${Object.keys(commandFile.usage).map(a => " " + a).join("")}\`, for additional help, see \`${prefix}help\`.`) as unknown as void;
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

	/*
	* Check for GitHub updates
	*/

	async function checkForGitHubUpdate(message) {
		if (message.channel.name == 'semblance-updates' && message.guild.id == sirhGuildId && message.author.username == 'GitHub' && message.embeds[0].title.includes('master')) {
			let infoHandler = await Information.findOneAndUpdate({ infoType: "github" }, { $set: { info: message.embeds[0].description, updated: true } }, { new: true });
			return true;
		}
		return false;
	}

	/*
	* Blacklisted word filtering
	*/

	let warnings: Collection<string, number> = new Collection();

	async function clearBlacklistedWord(message: Message, member: GuildMember) {
		if (message.guild.id != c2sGuildId && message.guild.id != sirhGuildId) return;
		let msg = message.content.toLowerCase();
		if (!msg.match(/(nigger)|(nigga)/g) ?? member.user.bot) return;
		message.delete();
		let modLog = message.guild.channels.cache.find(c => (c.name == 'mod-log' || c.name == 'mod-logs')) as TextChannel;
		let userWarnings = warnings.get(member.id);
		if (userWarnings) warnings.set(member.id, userWarnings + 1);
		else warnings.set(member.id, 1);
		if (warnings.get(member.id) === 3) {
			await member.ban({ days: 7, reason: "Used the n-word multiple times" });
			return await modLog.send({ embeds: [new MessageEmbed().setDescription(`${member.user.tag} has been banned for using the n-word multiple times.`)] });
		}
		if (modLog) await modLog.send({ embeds: [new MessageEmbed().setDescription(`${member.user.tag} used the n-word and has been warned.\n message: ${message.content}`)] });
		return await member.user.send(`This is a warning for using an explicit word, continuing this behavior may/will result in a ban. If you received this warning despite not actually using the explicit word (the n-word), please notify SirH#4297, else, please stop using the word.`);
	}

	async function updateBeyondCount() {
		const beyondCount = await Information.findOne({ infoType: 'beyondcount' });
		await Information.findOneAndUpdate({ infoType: 'beyondcount' }, { $set: { count: ++beyondCount.count } }, { new: true });
	}