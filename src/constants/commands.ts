import { Collection, Message, MessageEmbed, MessageReaction, PartialMessage, PartialUser, Snowflake, TextChannel, User } from "discord.js";
import { randomColor } from ".";
import { Afk, Game, Information, Reminder, Report, Votes } from "../models";
import { Semblance } from "../structures";
import config from '@semblance/config';
import { clamp } from "@semblance/lib/utils/math";
import { UserReminder } from "../models/Reminder";
import { APIParams } from "@semblance/lib/interfaces/catAndDogAPI";
import * as querystring from 'querystring';
import fetch from 'node-fetch';
import { GameFormat } from "../models/Game";
const { currentLogo } = config;

// AFK functions - dontDisturb and removeAfk

export const dontDisturb = async function(message: Message, mentioned: Collection<string, User>) {
    mentioned.forEach(async (user) => {
        if (message.author.id == user.id) return;
        let afkHandler = await Afk.findOne({ userId: user.id });
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
    let afkHandler = await Afk.findOneAndDelete({ userId: message.author.id });
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
    const reminderList = await Reminder.find({}), now = Date.now(); 
    if (!reminderList) return;
    const userReminders = {} as Record<Snowflake, UserReminder[]>;

    reminderList.filter(user => user.reminders.some(reminder => now > reminder.time)).forEach(user => {
        userReminders[user.userId] = user.reminders.filter(reminder => now > reminder.time);
    });
    
    for (const [key, value] of Object.entries(userReminders) as Array<(Snowflake | UserReminder[])[]>) {
        (value as UserReminder[]).forEach((reminder) => {
            (client.channels.cache.get(reminder.channelId) as TextChannel).send(`<@${key}> Reminder: ${reminder.message}`);
        });
        if (reminderList.find(user => user.userId == key).reminders.length == (value as UserReminder[]).length)
            await Reminder.findOneAndDelete({ userId: key as Snowflake });
        else 
            await Reminder.findOneAndUpdate({ userId: key as Snowflake }, { $set: { 
                reminders: reminderList.find(user => user.userId == key).reminders.filter(reminder => now < reminder.time)
                    .map((reminder, index) => {
                        reminder.reminderId = index+1;
                        return reminder;
                    })
            } });
    }
}

// bug functions and constants - correctReportList and CHANNELS

export const correctReportList = async function(client: Semblance, message: Message | PartialMessage, messageId: Snowflake) {
    let deletedReport = await Report.findOneAndDelete({ messageId: messageId });
    if (!deletedReport) return;
    let reportList = await Report.find({});
    let bugIdList = Array.from(reportList.map(r => r.bugId).filter(item => item > deletedReport.bugId));
    bugIdList.forEach(async (bugId) => {
        let report = await Report.findOneAndUpdate({ bugId: bugId }, { $set: { bugId: bugId - 1 } }, { new: true });
        try {
            (message.guild.channels.cache.get(report.channelId) as TextChannel).messages.fetch(report.messageId)
                .then((msg) => {
                    let author = msg.embeds[0].author;
                    msg.edit({ embeds: [msg.embeds[0].setAuthor(`${author.name.slice(0, author.name.indexOf('\n'))}\nBug Id: #${bugId - 1}`, author.iconURL).setFooter(`#${bugId - 1}`)] });
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
        for (let j = serversPerPage * i; j <= loopCount; j++) guildBook[`page_${i + 1}`][`${client.guilds.cache.map(c => c)[j].name}`] = `${client.guilds.cache.map(c => c)[j].id}`;
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

// imagegen API fetch
export const fetchCatOrDog = async (query_params: APIParams, wantsCat: boolean) => {
    const API_URL = `https://api.the${wantsCat ? 'cat' : 'dog'}api.com/v1/images/search?${new URLSearchParams(query_params as Record<string, string>)}`,
    API_KEY = wantsCat ? process.env.CAT_API_KEY : process.env.DOG_API_KEY;

    return (await fetch(API_URL, { headers: { 'X-API-KEY': API_KEY } })).json();
}

// game - currentPrice

export async function currentPrice(userData: GameFormat) {
    if (userData.level == userData.checkedLevel) {
        userData = await Game.findOneAndUpdate({ player: userData.player }, {
            $set: { checkedLevel: userData.checkedLevel+1, cost: userData.cost + userData.baseCost * Math.pow(userData.percentIncrease, userData.level + 1) }
        }, { new: true });
        return userData.cost;
    }
    return (userData.cost == 0) ? userData.baseCost : userData.cost;
}