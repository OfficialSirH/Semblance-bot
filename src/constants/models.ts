import type { SapphireClient } from '@sapphire/framework';
import { Embed } from 'discord.js';
import type { TextChannel, GuildMember, Message } from 'discord.js';
import { sirhId, adityaId, c2sGuildId, darwinium } from '#config';
import { formattedDate } from '#constants/index';
import { scheduleJob } from 'node-schedule';
import type { BoosterReward, Reminder, UserReminder } from '@prisma/client';

//j BoosterRewards - handle finished booster rewards
export const handleBoosterReward = async (client: SapphireClient, boosterReward: BoosterReward) => {
  const member: GuildMember = await client.guilds.cache
    .get(c2sGuildId)
    .members.fetch(boosterReward.userId)
    .catch(() => null);
  if (!member ?? !member.roles.cache.has(boosterRole))
    // return BoosterRewards.findOneAndDelete({ userId: boosterReward.userId });
    return client.db.boosterReward.delete({ where: { userId: boosterReward.userId } });

  // const darwiniumCodes = (await Information.findOne({
  //   infoType: 'boostercodes',
  // })) as InformationFormat<'boostercodes'>;
  const darwiniumCodes = await client.db.boosterCodes.findMany({});

  if (darwiniumCodes.length == 0)
    return boosterChannel(client).send({
      content: `<@${sirhId}> <@${adityaId}> No booster codes left! ${member.user.tag} needs a code`,
      allowedMentions: { users: [sirhId, adityaId] },
    });

  const ogCodeLength = darwiniumCodes.length,
    darwiniumCode = darwiniumCodes.shift();

  await member.user
    .send({
      embeds: [
        new Embed()
          .setTitle('Booster reward')
          .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
          .setDescription(
            `Thank you for boosting Cell to Singularity for 2 weeks! As a reward, here's 150 ${darwinium}!\nCode: ||${darwiniumCode.code}||`,
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
      darwiniumCodes.unshift(darwiniumCode);
    });

  if (darwiniumCodes.length != ogCodeLength)
    //   await Information.findOneAndUpdate({ infoType: 'boostercodes' }, { $set: { list: darwiniumCodes.list } });
    await client.db.boosterCodes.delete({
      where: {
        id: darwiniumCode.id,
      },
    });
  // await BoosterRewards.findOneAndDelete({ userId: boosterReward.userId });
  return client.db.boosterReward.update({
    where: { userId: boosterReward.userId },
    data: { rewardingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) },
  });
};

export const boosterChannel = (client: SapphireClient) =>
  client.channels.cache.get('800981350714834964') as TextChannel;
export const boosterRole = '660930089990488099';

// BoosterRewards - create automatic booster rewards for author of message
export const createBoosterRewards = async (client: SapphireClient, message: Message) => {
  // const boosterReward = await BoosterRewards.findOne({
  //   userId: message.author.id,
  // });
  const boosterReward = await client.db.boosterReward.findUnique({ where: { userId: message.author.id } });
  if (boosterReward) return;
  // BoosterRewards.create({
  //   userId: message.author.id,
  //   rewardingDate: Date.now() + 1000 * 60 * 60 * 24 * 14,
  // })
  const newBoosterReward = await client.db.boosterReward.create({
    data: {
      userId: message.author.id,
      rewardingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    },
  });

  if (!newBoosterReward)
    return message.channel.send({
      content: `<@${sirhId}> the automated rewarder failed at creating the scheduled reward for ${message.author.username}`,
      allowedMentions: { users: [sirhId] },
    });

  message.channel.send(
    `Thank you for boosting the server, ${
      message.author.username
    }! You will receive your booster reward on ${formattedDate(newBoosterReward.rewardingDate.valueOf())}`,
  );
  scheduleJob(newBoosterReward.rewardingDate, () => handleBoosterReward(client, newBoosterReward));

  // .catch(() =>
  //   message.channel.send({
  //     content: `<@${sirhId}> the automated rewarder failed at creating the scheduled reward for ${message.author.username}`,
  //     allowedMentions: { users: [sirhId] },
  //   }),
  // );
};

// Reminder - handle finished reminder
export const handleReminder = async (client: SapphireClient, reminderData: Reminder, reminder: UserReminder) => {
  (client.channels.cache.get(reminder.channelId) as TextChannel)?.send({
    content: `<@${reminderData.userId}> Reminder: ${reminder.message}`,
    allowedMentions: { users: [reminderData.userId] },
  });
  if (reminderData.reminders.length == 1)
    // return Reminder.findOneAndDelete({ userId: reminderData.userId });
    return client.db.reminder.delete({ where: { userId: reminderData.userId } });

  // return Reminder.findOneAndUpdate(
  //   { userId: reminderData.userId },
  //   { $set: { reminders: reminderData.reminders.filter(r => r.reminderId != reminder.reminderId) } },
  // );
  return client.db.reminder.update({
    where: { userId: reminderData.userId },
    data: { reminders: reminderData.reminders.filter(r => r.reminderId != reminder.reminderId) as object[] },
  });
};

// // reminder functions - checkReminders
// export const checkReminders = async (client: SapphireClient) => {
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
