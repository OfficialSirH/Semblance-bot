import { Message, GuildMember } from "discord.js";
import { Semblance } from "../structures";
import { BoosterRewards } from "../models";
import { formattedDate } from "../constants";


module.exports = {
    description: 'interact with booster rewards for users',
    category: 'developer',
    permissionRequired: 7,
    checkArgs: (args: string[]) => args.length >= 1,
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    let user = message.mentions.members.first();
    let userId = user ? user.id : args.filter(a => a.match(/^<@!?\d{16,19}>$/)).shift();
    if (!user && !userId) return message.reply('You must refer to a user by ID or mention');
    
    if (args.includes('add')) addBooster(message, userId);
    if (args.includes('remove')) removeBooster(message, userId);
    if (args.includes('list')) listBoosters(message);
}

const addBooster = async (message: Message, user: string | GuildMember) => {
    let userId = user instanceof GuildMember ? user.id : user;

    let boosterRewards = await BoosterRewards.findOne({ userId });
    if (boosterRewards) return message.reply(`That user is already listed to receive an automated reward on ${formattedDate(boosterRewards.rewardingDate)}`);

    boosterRewards = new BoosterRewards({ userId });
    await boosterRewards.save();
    message.reply(`That user will now receive an automated reward on ${formattedDate(boosterRewards.rewardingDate)}`);
};

const removeBooster = async (message: Message, user: string | GuildMember) => {
    let userId = user instanceof GuildMember ? user.id : user;
    let boosterRewards = await BoosterRewards.findOne({ userId });
    if (!boosterRewards) return message.reply('That user is not listed to receive an automated reward');
    boosterRewards.remove();
}

const listBoosters = async (message: Message) => {
    let boosterRewards = await BoosterRewards.find({});
    if (!boosterRewards.length) return message.reply('There are no booster rewards to list');
    message.channel.send(`There are ${boosterRewards.length} booster rewards currently listed:\n${boosterRewards.reduce((acc, cur) => acc += `${cur.userId} - ${formattedDate(cur.rewardingDate)}`, '')}`);
};