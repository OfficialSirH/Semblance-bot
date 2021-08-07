import { Semblance } from '@semblance/structures';
import { BoosterRewards, Information } from '@semblance/models';
import { Message, TextChannel } from 'discord.js';
import config from '@semblance/config';
import { formattedDate } from '.';
const { sirhId, adityaId } = config;

// BoosterRewards - check dates for booster rewards
export const checkBoosterRewards = async (client: Semblance) => {
    let boosterRewards = await BoosterRewards.find({});
    const now = Date.now();
    boosterRewards = boosterRewards.filter(boosterReward => boosterReward.rewardingDate < now);
    if (boosterRewards.length == 0) return;
    const darwiniumCodes = await Information.findOne({ infoType: 'boostercodes' });
    if (darwiniumCodes.list.length == 0) {
        if (darwiniumCodes.updated) {
            boosterChannel(client).send(`<@${sirhId}> <@${adityaId}> No booster codes left!`+
            ` The following users need codes: ${boosterRewards.map(c => c.userId).join(', ')}`);
            return darwiniumCodes.update({ updated: false });
        }
        return;
    }
    const promises = [];
    boosterRewards.forEach(async boosterReward => {
        const ogCodeLength = darwiniumCodes.list.length, darwiniumCode = darwiniumCodes.list.shift();
        const user = await client.users.fetch(boosterReward.userId);
        user.send(`Here's your code, ${user.username}! Code: ${darwiniumCode}`)
        .catch(async err => {
            await boosterChannel(client).send(`<@${user.id}> I had trouble DMing you so instead Aditya or SirH will manually provide you a code. :)`+
            `\nTip: These errors tend to happen when your DMs are closed. So keeping them open would help us out :D`);
            darwiniumCodes.list.unshift(darwiniumCode);
        });
        if (darwiniumCodes.list.length != ogCodeLength) promises.push(darwiniumCodes.update({ list: darwiniumCodes.list }));
        promises.push(boosterReward.delete());
    });
    return Promise.all(promises);
};

export const boosterChannel = (client: Semblance) => client.channels.cache.get('547455179302109186') as TextChannel;

// BoosterRewards - create automatic booster rewards for author of message
export const createBoosterRewards = async (message: Message) => {
    const boosterReward = await BoosterRewards.findOne({ userId: message.author.id });
    if (boosterReward) return;
    BoosterRewards.create({ userId: message.author.id })
    .then(br => message.channel.send(`Thank you for boosting the server, ${message.author.username}! You will receive your booster reward on ${formattedDate(br.rewardingDate)}`))
    .catch(err => message.channel.send(`<@${sirhId}> the automated rewarder failed at creating the scheduled reward for ${message.author.username}`));
}