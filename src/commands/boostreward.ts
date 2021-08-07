import { Message, Constants } from "discord.js";
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
    let user = message.mentions.users.first();
    let userId = user ? user.id : args.filter(a => a.match(/^<@!?\d{16,19}>$/)).shift();
    if (!user && !userId) return message.reply('You must refer to a user by ID or mention');
    
    let boosterRewards = await BoosterRewards.findOne({ userId });
    if (boosterRewards) return message.reply(`That user is already listed to receive an automated reward on ${formattedDate(boosterRewards.rewardingDate)}`);

    boosterRewards = new BoosterRewards({ userId });
    await boosterRewards.save();
    message.reply(`That user will now receive an automated reward on ${formattedDate(boosterRewards.rewardingDate)}`);
}