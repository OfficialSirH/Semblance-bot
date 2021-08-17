import { Semblance } from '@semblance/structures';
import { BoosterRewards, Information } from '@semblance/models';
import { GuildMember, Message, MessageEmbed, TextChannel } from 'discord.js';
import config from '@semblance/config';
import { formattedDate } from '.';
const { sirhId, adityaId, c2sGuildId, darwinium } = config;

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
        let failedToFetch: boolean, member: GuildMember;
        try {
            member = await client.guilds.cache.get(c2sGuildId).members.fetch(boosterReward.userId);
        } catch (e) {
            failedToFetch = true;
        } finally {
            if (failedToFetch) return promises.push(boosterReward.remove());        
            if (!member.roles.cache.has(boosterRole(client).id)) return promises.push(boosterReward.remove());
            member.user.send({ embeds: [new MessageEmbed().setTitle('Booster reward')
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .setDescription(`Thank you for boosting Cell to Singularity for 2 weeks! As a reward, here's 150 ${darwinium}!\nCode: ||${darwiniumCode}||`)] })
            .catch(async err => {
                await boosterChannel(client).send(`${member} I had trouble DMing you so instead Aditya or SirH will manually provide you a code. :)`+
                `\nTip: These errors tend to happen when your DMs are closed. So keeping them open would help us out :D`);
                darwiniumCodes.list.unshift(darwiniumCode);
            });
            if (darwiniumCodes.list.length != ogCodeLength) promises.push(darwiniumCodes.update({ list: darwiniumCodes.list }));
            promises.push(boosterReward.delete());
        }
    });
    return Promise.all(promises);
};

export const boosterChannel = (client: Semblance) => client.channels.cache.get('547455179302109186') as TextChannel;
export const boosterRole = (client: Semblance) => client.guilds.cache.get(c2sGuildId).roles.cache.get('660930089990488099');

// BoosterRewards - create automatic booster rewards for author of message
export const createBoosterRewards = async (message: Message) => {
    const boosterReward = await BoosterRewards.findOne({ userId: message.author.id });
    if (boosterReward) return;
    BoosterRewards.create({ userId: message.author.id, rewardingDate: Date.now() + 1000 * 60 * 60 * 24 * 14 })
    .then(br => message.channel.send(`Thank you for boosting the server, ${message.author.username}! You will receive your booster reward on ${formattedDate(br.rewardingDate)}`))
    .catch(err => message.channel.send(`<@${sirhId}> the automated rewarder failed at creating the scheduled reward for ${message.author.username}`));
}