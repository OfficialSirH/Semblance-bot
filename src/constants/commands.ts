import { Collection, Message, MessageEmbed, MessageReaction, PartialMessage, PartialUser, Snowflake, TextChannel, User } from "discord.js";
import { randomColor } from ".";
import { Afk, Game, Information, Reminder, Report, Votes } from "../models";
import { Semblance } from "../structures";
import config from '@semblance/config';
import { clamp } from "@semblance/lib/utils/math";
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
        message.reply({ embeds: [embed] });
    });
}

export async function removeAfk(client: Semblance, message: Message) {
    if (message.author.id == client.user.id) return;
    let afkHandler = await Afk.findOneAndDelete({ userID: message.author.id });
    if (afkHandler) message.reply("You are no longer AFK");
}

// gametransfer pages

export const gameTransferPages = ["https://i.imgur.com/BsjMAu6.png",
		"https://i.imgur.com/QbDAOkF.png",
		"https://i.imgur.com/w1jEuzh.png",
		"https://i.imgur.com/6qTz2Li.png",
		"https://i.imgur.com/YNBHSw9.png"];

// reminder functions - checkReminders

export const checkReminders = async (client: Semblance) => {
    if (!client.readyAt) return;
    let reminderList = await Reminder.find({});
    if (!reminderList) return;
    const userReminders = {} as Record<Snowflake, string>;
    reminderList.filter((user) => Date.now() > user.remind).forEach((user) => userReminders[user.userID] = user.reminder);

    for (const [key, value] of Object.entries(userReminders) as Array<any[]>) {
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
                    msg.edit({ embeds: [msg.embeds[0].setAuthor(`${author.name.slice(0, author.name.indexOf('\n'))}\nBug ID: #${bugID - 1}`, author.iconURL).setFooter(`#${bugID - 1}`)] });
                });
        } catch (e) {
            console.error(e);
            throw new Error("Apparently there was an issue finding that message...");
        }
    });
    console.log(`All ${bugIdList.length} reports have successfully been reorganized!`);
}

export const bugChannels = {
    queue: '798933535255298078' as Snowflake,
    approved: '798933965539901440' as Snowflake
};

// RPS functions and constants

export const countdownGIF = 'https://cdn.discordapp.com/emojis/679872091922759760.gif?v=1';

export function choiceToOutcome(choice: string, opponentChoice: string) {
    if (choice == 'rock') {
        if (opponentChoice == 'paper') return false;
        if (opponentChoice == 'scissors') return true;
        if (opponentChoice == 'lizard') return true;
        if (opponentChoice == 'spock') return false;
        if (opponentChoice == 'rock') return 'tie';
    }
    if (choice == 'paper') {
        if (opponentChoice == 'paper') return 'tie';
        if (opponentChoice == 'scissors') return false;
        if (opponentChoice == 'rock') return true;
        if (opponentChoice == 'lizard') return false;
        if (opponentChoice == 'spock') return true;
    }
    if (choice == 'scissors') {
        if (opponentChoice == 'paper') return true;
        if (opponentChoice == 'scissors') return 'tie';
        if (opponentChoice == 'rock') return false;
        if (opponentChoice == 'lizard') return true;
        if (opponentChoice == 'spock') return false;
    }
    if (choice == 'lizard') {
        if (opponentChoice == 'paper') return true;
        if (opponentChoice == 'scissors') return false;
        if (opponentChoice == 'rock') return false;
        if (opponentChoice == 'lizard') return 'tie';
        if (opponentChoice == 'spock') return true;
    }
    if (choice == 'spock') {
        if (opponentChoice == 'paper') return false;
        if (opponentChoice == 'scissors') return true;
        if (opponentChoice == 'rock') return true;
        if (opponentChoice == 'lizard') return false;
        if (opponentChoice == 'spock') return 'tie';
    }
    return null;
}

export const randomChoice = () => ['rock','paper','scissors','lizard','spock'][Math.floor(Math.random()*5)];

// Serverlist function - Guild Book

export const serversPerPage = 50;

export function guildBookPage(client: Semblance, chosenPage: string | number) {
    chosenPage = Number.parseInt(chosenPage as string);
    let guildBook = {},
	numOfPages = Math.ceil(client.guilds.cache.size / serversPerPage);

	if (!chosenPage) chosenPage = 1;
	else chosenPage = clamp(chosenPage, 1, numOfPages);

	for (let i = 0; i < numOfPages; i++) {
        guildBook[`page_${i + 1}`] = {};
        let loopCount = client.guilds.cache.size < (serversPerPage - 1) + (i * serversPerPage) ? client.guilds.cache.size - 1 : (serversPerPage - 1) + (i * serversPerPage);
        for (let j = serversPerPage * i; j <= loopCount; j++) guildBook[`page_${i + 1}`][`${client.guilds.cache.array()[j].name}`] = `${client.guilds.cache.array()[j].id}`;
    }

	let pageDetails = "";
	for (const [key, value] of Object.entries(guildBook[`page_${chosenPage}`])) {
		pageDetails += `${key} : ${value}\n`;
	}

    return {
        chosenPage,
        pageDetails
    };
}