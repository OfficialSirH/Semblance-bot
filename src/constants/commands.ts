import { Collection, Message, MessageEmbed, MessageReaction, PartialMessage, PartialUser, Snowflake, TextChannel, User } from "discord.js";
import { insertionSort, randomColor } from ".";
import { leaderboardList } from "../commands/leaderboard";
import { Afk, Game, Information, Reminder, Report, Votes } from "../models";
import { Semblance } from "../structures";
import config from '@semblance/config';
const { currentLogo } = config;

// AFK functions - dontDisturb and removeAfk

export const dontDisturb = async function(message: Message, mentioned: Collection<string, User>) {
    mentioned.forEach(async (user) => {
        if (message.author.id == user.id) return;
        let afkHandler = await Afk.findOne({ userID: user.id });
        if (!afkHandler) return;
        let reason = afkHandler.reason;
        let embed = new MessageEmbed()
            .setTitle("Currently Afk")
            .setColor(randomColor)
            .setThumbnail(user.displayAvatarURL())
            .setDescription(`${user.tag} is currently afk`)
            .addField("Reason", `${reason}`);
        message.reply(embed);
    });
}

export async function removeAfk(client: Semblance, message: Message) {
    if (message.author.id == client.user.id) return;
    let afkHandler = await Afk.findOneAndDelete({ userID: message.author.id });
    if (!afkHandler) message.reply("You are no longer AFK");
}

// gameTransfer functions - turnPage

export const gameTransferPages = ["https://i.imgur.com/BsjMAu6.png",
		"https://i.imgur.com/QbDAOkF.png",
		"https://i.imgur.com/w1jEuzh.png",
		"https://i.imgur.com/6qTz2Li.png",
		"https://i.imgur.com/YNBHSw9.png"];

export async function turnPage(reaction: MessageReaction, user: User | PartialUser) {
	let embed = reaction.message.embeds[0];
	if (!embed ?? !embed.footer ?? user.id != embed.footer ?? !embed.image ?? !gameTransferPages.includes(embed.image.url)) return;

	let currentPage = gameTransferPages.indexOf(embed.image.url);
	
	if (reaction.emoji.name == "➡️") {
		currentPage = (currentPage == 4) ? 0 : ++currentPage;
		embed = new MessageEmbed()
			.setTitle("Game Transfer")
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(randomColor)
			.attachFiles([currentLogo])
			.setThumbnail(currentLogo.name)
			.setImage(gameTransferPages[currentPage])
			.setDescription(`Step ${currentPage + 1}:`);
		reaction.message.edit(embed);
		RemoveReaction(reaction, user);

	} else if (reaction.emoji.name == "⬅️") {
		currentPage = (currentPage == 0) ? 4 : --currentPage;
		embed = new MessageEmbed()
			.setTitle("Game Transfer")
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(randomColor)
			.attachFiles([currentLogo])
			.setThumbnail(currentLogo.name)
			.setImage(gameTransferPages[currentPage])
			.setDescription(`Step ${currentPage + 1}:`);
		reaction.message.edit(embed);
		RemoveReaction(reaction, user);
	}
}

async function RemoveReaction(reaction: MessageReaction, user: User | PartialUser) {
	try { await reaction.users.remove(user as User); } catch (error) { console.log("That didn't work D:") }
} 

// game functions - updateGameLeaderboard

export const updateGameLeaderboard = async function(client: Semblance) {
    let users = {}, mappedUsers = await Game.find({}), cacheList = await Information.findOne({ infoType: 'cacheList' });
    mappedUsers.forEach(user => users[user.player] = user.level);
    let list: any = [];
    for (const [key, value] of Object.entries(users)) {
        let user = (!!client.users.cache.get(key)) ? client.users.cache.get(key) : null;
        if (!user) {
            let newList = [...cacheList.list, key];
            await Information.findOneAndUpdate({ infoType: 'cacheList' }, { $set: { list: newList } }, { new: true });
            user = await client.users.fetch(key);
        }
        list.push([user.tag, value]);
    }
    list = insertionSort(list).filter((item, ind) => ind < 20).reduce((total, cur, ind) => total += `${ind + 1}. ${cur[0]} - level ${cur[1]}\n`, '');
    if (!list) Information.findOneAndUpdate({ infoType: 'gameleaderboard' }, { $set: { info: 'There is currently no one who has upgraded their income.' } });
    else Information.findOneAndUpdate({ infoType: 'gameleaderboard' }, { $set: { info: list } });
    setTimeout(() => updateGameLeaderboard(client), 50000);
}

// leaderboard functions - updateVoteLeaderboard

export const updateVoteLeaderboard = async function(client: Semblance) {
	let users = {}, mappedUsers = await Votes.find({}), cacheList = await Information.findOne({ infoType: 'cacheList' });
	mappedUsers.forEach(async (user, ind) => users[user.user] = user.voteCount);
	let list: any = [];
	for (const [key, value] of Object.entries(users)) {
		let user = (!!client.users.cache.get(key)) ? client.users.cache.get(key) : null;
		if (!user) {
			let newList = [...cacheList.list, key];
			await Information.findOneAndUpdate({ infoType: 'cacheList' }, { $set: { list: newList } }, { new: true });
			user = await client.users.fetch(key);
        }
		list.push([user.tag, value]);
	}
	list = insertionSort(list).filter((item, ind) => ind < 20).reduce((total, cur, ind) => total += `${ind + 1}. ${cur[0]} - ${cur[1]} vote(s)\n`, '');
	if (!list) Information.findOneAndUpdate({ infoType: 'voteleaderboard' }, { $set: { info: 'There is currently no voters for this month.' } });
	else Information.findOneAndUpdate({ infoType: 'voteleaderboard' }, { $set: { info: list } });
	setTimeout(() => updateVoteLeaderboard(client), 50000);
}

// reminder functions - checkReminders

export const checkReminders = async (client: Semblance) => {
    if (!client.readyAt) return;
    let reminderList = await Reminder.find({});
    if (!reminderList) return;
    const userReminders = {};
    reminderList.filter((user) => Date.now() > user.remind).forEach((user) => userReminders[user.userID] = user.reminder);

    for (const [key, value] of Object.entries(userReminders)) {
        let user = await client.users.fetch(key);
        user.send(`Reminder: ${value}`);
        await Reminder.findOneAndDelete({ userID: key });
    }
}

// bug functions and constants - correctReportList and CHANNELS

export const correctReportList = async function(client: Semblance, message: Message | PartialMessage, messageID: Snowflake) {
    let deletedReport = await Report.findOneAndDelete({ messageID: messageID });
    if (!deletedReport) return;
    let reportList = await Report.find({});
    let bugIdList = Array.from(reportList.map(r => r.bugID).filter(item => item > deletedReport.bugID));
    bugIdList.forEach(async (bugID) => {
        let report = await Report.findOneAndUpdate({ bugID: bugID }, { $set: { bugID: bugID - 1 } }, { new: true });
        try {
            (message.guild.channels.cache.get(report.channelID) as TextChannel).messages.fetch(report.messageID)
                .then((msg) => {
                    let author = msg.embeds[0].author;
                    msg.edit(msg.embeds[0].setAuthor(`${author.name.slice(0, author.name.indexOf('\n'))}\nBug ID: #${bugID - 1}`, author.iconURL).setFooter(`#${bugID - 1}`));
                });
        } catch (e) {
            console.error(e);
            throw new Error("Apparently there was an issue finding that message...");
        }
    });
    console.log(`All ${bugIdList.length} reports have successfully been reorganized!`);
}

export const bugChannels = {
    queue: '798933535255298078',
    approved: '798933965539901440'
};