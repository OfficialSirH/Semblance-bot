import type { Semblance } from '#structures/Semblance';
import { BoosterRewards, Information } from '#models/index';
import { Client, MessageEmbed } from 'discord.js';
import type { TextChannel, GuildMember, Message } from 'discord.js';
import { sirhId, adityaId, c2sGuildId, darwinium } from '#config';
import { formattedDate } from '#constants/index';
import type { InformationFormat } from '#models/Information';
import type { BoosterRewardsFormat } from '#models/BoosterRewards';
import { scheduleJob } from 'node-schedule';
import { Reminder, ReminderFormat, UserReminder } from '#models/Reminder';

// BoosterRewards - check dates for booster rewards
// export const checkBoosterRewards = async (client: Semblance) => {
//   let boosterRewards = await BoosterRewards.find({});
//   const now = Date.now();
//   boosterRewards = boosterRewards.filter(boosterReward => boosterReward.rewardingDate < now);
//   if (boosterRewards.length == 0) return;
//   const darwiniumCodes = (await Information.findOne({
//     infoType: 'boostercodes',
//   })) as InformationFormat<'boostercodes'>;
//   if (darwiniumCodes.list.length == 0) {
//     if (darwiniumCodes.updated) {
//       boosterChannel(client).send({
//         content:
//           `<@${sirhId}> <@${adityaId}> No booster codes left!` +
//           ` The following users need codes: ${boosterRewards.map(c => c.userId).join(', ')}`,
//         allowedMentions: { users: [sirhId, adityaId] },
//       });
//       return Information.findOneAndUpdate({ infoType: 'boostercodes' }, { $set: { updated: false } });
//     }
//     return;
//   }
//   const promises = [];
//   boosterRewards.forEach(async boosterReward => {
//     const ogCodeLength = darwiniumCodes.list.length,
//       darwiniumCode = darwiniumCodes.list.shift();
//     darwiniumCodes.list = darwiniumCodes.list.filter(c => c != darwiniumCode);
//     const member = await client.guilds.cache
//       .get(c2sGuildId)
//       .members.fetch(boosterReward.userId)
//       .catch(() => 'failed' as const);
//     if (member == 'failed') return promises.push(boosterReward.remove());
//     if (!member.roles.cache.has(boosterRole)) return promises.push(boosterReward.remove());
//     await member.user
//       .send({
//         embeds: [
//           new MessageEmbed()
//             .setTitle('Booster reward')
//             .setAuthor(member.user.tag, member.user.displayAvatarURL())
//             .setDescription(
//               `Thank you for boosting Cell to Singularity for 2 weeks! As a reward, here's 150 ${darwinium}!\nCode: ||${darwiniumCode}||`,
//             ),
//         ],
//       })
//       .catch(async err => {
//         console.log(`There was an issue with sending the code to ${member.user.tag}: ${err}`);
//         await boosterChannel(client).send({
//           content:
//             `${member} I had trouble DMing you so instead Aditya or SirH will manually provide you a code. :)` +
//             '\nTip: These errors tend to happen when your DMs are closed. So keeping them open would help us out :D',
//           allowedMentions: { users: [member.id] },
//         });
//         darwiniumCodes.list.unshift(darwiniumCode);
//       });
//     if (darwiniumCodes.list.length != ogCodeLength)
//       promises.push(
//         Information.findOneAndUpdate({ infoType: 'boostercodes' }, { $set: { list: darwiniumCodes.list } }),
//       );
//     promises.push(boosterReward.delete());
//   });
//   return Promise.all(promises);
// };

//j BoosterRewards - handle finished booster rewards
export const handleBoosterReward = async (client: Client, boosterReward: BoosterRewardsFormat) => {
  const member: GuildMember = await client.guilds.cache
    .get(c2sGuildId)
    .members.fetch(boosterReward.userId)
    .catch(() => null);
  if (!member ?? !member.roles.cache.has(boosterRole))
    return await BoosterRewards.findOneAndDelete({ userId: boosterReward.userId });

  const darwiniumCodes = (await Information.findOne({
    infoType: 'boostercodes',
  })) as InformationFormat<'boostercodes'>;

  if (darwiniumCodes.list.length == 0)
    return boosterChannel(client).send({
      content: `<@${sirhId}> <@${adityaId}> No booster codes left! ${member.user.tag} needs a code`,
      allowedMentions: { users: [sirhId, adityaId] },
    });

  const ogCodeLength = darwiniumCodes.list.length,
    darwiniumCode = darwiniumCodes.list.shift();

  await member.user
    .send({
      embeds: [
        new MessageEmbed()
          .setTitle('Booster reward')
          .setAuthor(member.user.tag, member.user.displayAvatarURL())
          .setDescription(
            `Thank you for boosting Cell to Singularity for 2 weeks! As a reward, here's 150 ${darwinium}!\nCode: ||${darwiniumCode}||`,
          ),
      ],
    })
    .catch(async err => {
      console.log(`There was an issue with sending the code to ${member.user.tag}: ${err}`);
      await boosterChannel(client).send({
        content:
          `${member} I had trouble DMing you so instead Aditya or SirH will manually provide you a code. :)` +
          '\nTip: These errors tend to happen when your DMs are closed. So keeping them open would help us out :D',
        allowedMentions: { users: [member.id] },
      });
      darwiniumCodes.list.unshift(darwiniumCode);
    });

  if (darwiniumCodes.list.length != ogCodeLength)
    await Information.findOneAndUpdate({ infoType: 'boostercodes' }, { $set: { list: darwiniumCodes.list } });
  await BoosterRewards.findOneAndDelete({ userId: boosterReward.userId });
};

export const boosterChannel = (client: Client) => client.channels.cache.get('800981350714834964') as TextChannel;
export const boosterRole = '660930089990488099';

// BoosterRewards - create automatic booster rewards for author of message
export const createBoosterRewards = async (client: Semblance, message: Message) => {
  const boosterReward = await BoosterRewards.findOne({
    userId: message.author.id,
  });
  if (boosterReward) return;
  BoosterRewards.create({
    userId: message.author.id,
    rewardingDate: Date.now() + 1000 * 60 * 60 * 24 * 14,
  })
    .then(br => {
      message.channel.send(
        `Thank you for boosting the server, ${
          message.author.username
        }! You will receive your booster reward on ${formattedDate(br.rewardingDate)}`,
      );
      scheduleJob(new Date(br.rewardingDate), () => handleBoosterReward(client, br));
    })
    .catch(() =>
      message.channel.send({
        content: `<@${sirhId}> the automated rewarder failed at creating the scheduled reward for ${message.author.username}`,
        allowedMentions: { users: [sirhId] },
      }),
    );
};

// Reminder - handle finished reminder
export const handleReminder = async (client: Client, reminderData: ReminderFormat, reminder: UserReminder) => {
  (client.channels.cache.get(reminder.channelId) as TextChannel)?.send(reminder.message);
  if (reminderData.reminders.length == 1) await Reminder.findOneAndDelete({ userId: reminderData.userId });
  else
    await Reminder.findOneAndUpdate(
      { userId: reminderData.userId },
      { $set: { reminders: reminderData.reminders.filter(r => r.reminderId != reminder.reminderId) } },
    );
};

// // reminder functions - checkReminders
// export const checkReminders = async (client: Semblance) => {
//   const reminderList = await Reminder.find({}),
//     now = Date.now();
//   if (!reminderList) return;
//   const userReminders = {} as Record<Snowflake, UserReminder[]>;

//   reminderList
//     .filter(user => user.reminders.some(reminder => now > reminder.time))
//     .forEach(user => {
//       userReminders[user.userId] = user.reminders.filter(reminder => now > reminder.time);
//     });

//   for (const [key, value] of Object.entries(userReminders) as [Snowflake, UserReminder[]][]) {
//     (value as UserReminder[]).forEach(reminder => {
//       (client.channels.cache.get(reminder.channelId) as TextChannel).send({
//         content: `<@${key}> Reminder: ${reminder.message}`,
//         allowedMentions: { users: [key] },
//       });
//     });
//     if (reminderList.find(user => user.userId == key).reminders.length == (value as UserReminder[]).length)
//       await Reminder.findOneAndDelete({ userId: key as Snowflake });
//     else
//       await Reminder.findOneAndUpdate(
//         { userId: key as Snowflake },
//         {
//           $set: {
//             reminders: reminderList
//               .find(user => user.userId == key)
//               .reminders.filter(reminder => now < reminder.time)
//               .map((reminder, index) => {
//                 reminder.reminderId = index + 1;
//                 return reminder;
//               }),
//           },
//         },
//       );
//   }
// };
