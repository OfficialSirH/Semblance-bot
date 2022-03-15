import type { SapphireClient } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';
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
    return client.db.boosterReward.delete({ where: { userId: boosterReward.userId } });

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
        new MessageEmbed()
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
    await client.db.boosterCodes.delete({
      where: {
        id: darwiniumCode.id,
      },
    });

  return client.db.boosterReward.update({
    where: { userId: boosterReward.userId },
    data: { rewardingDate: new Date(Date.now() + 1000 * 3600 * 24 * 28) },
  });
};

export const boosterChannel = (client: SapphireClient) =>
  client.channels.cache.get('800981350714834964') as TextChannel;
export const boosterRole = '660930089990488099';

// BoosterRewards - create automatic booster rewards for author of message
export const createBoosterRewards = async (client: SapphireClient, message: Message) => {
  const boosterReward = await client.db.boosterReward.findUnique({ where: { userId: message.author.id } });
  if (boosterReward) return;

  const newBoosterReward = await client.db.boosterReward.create({
    data: {
      userId: message.author.id,
      rewardingDate: new Date(Date.now() + 1000 * 3600 * 24 * 28),
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
};

// Reminder - handle finished reminder
export const handleReminder = async (client: SapphireClient, reminderData: Reminder, reminder: UserReminder) => {
  (client.channels.cache.get(reminder.channelId) as TextChannel)?.send({
    content: `<@${reminderData.userId}> Reminder: ${reminder.message}`,
    allowedMentions: { users: [reminderData.userId] },
  });
  if (reminderData.reminders.length == 1) return client.db.reminder.delete({ where: { userId: reminderData.userId } });

  return client.db.reminder.update({
    where: { userId: reminderData.userId },
    data: { reminders: reminderData.reminders.filter(r => r.reminderId != reminder.reminderId) as object[] },
  });
};
