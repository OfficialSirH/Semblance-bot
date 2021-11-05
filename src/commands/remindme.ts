import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor, formattedDate, timeInputRegex, timeInputToMs, prefix } from '#constants/index';
import { Reminder } from '#models/Reminder';
import type { Command } from '#lib/interfaces/Semblance';
import type { TimeLengths } from '#lib/interfaces/remindme';

export default {
  description: 'Set a reminder for yourself.',
  category: 'utility',
  usage: {
    '<time(3M2w5d6h4m)> <reminder>': '',
  },
  examples: {
    exampleOne: `${prefix}remindme 1h I've got magical stuff to do in 1 hour!`,
  },
  permissionRequired: 0,
  checkArgs: args => args.length >= 2,
  run: (_client, message, args) => run(message, args),
} as Command<'utility'>;

const run = async (message: Message, args: string[]) => {
  const timeAmount = timeInputRegex.exec(args[0]);
  if (timeAmount == null)
    return message.reply('Your input for time is invalid, please try again.').then(msg =>
      setTimeout(() => {
        if (!msg.deleted) msg.delete();
      }, 5000),
    );
  const {
    groups: { months = 0, weeks = 0, days = 0, hours = 0, minutes = 0 },
  } = timeAmount as unknown as TimeLengths;
  if ([months, weeks, days, hours, minutes].every(time => !time))
    return message.reply('Your input for time was invalid, please try again.').then(msg =>
      setTimeout(() => {
        if (!msg.deleted) msg.delete();
      }, 5000),
    );

  const reminder = args.splice(1, args.length).join(' ');
  const totalTime = timeInputToMs(months, weeks, days, hours, minutes);

  if (totalTime > 29030400000) return message.reply('You cannot create a reminder for longer than a year');
  const currentReminderData = await Reminder.findOne({
    userId: message.author.id,
  });
  if (currentReminderData?.reminders.length >= 5)
    return message.reply('You cannot have more than 5 reminders at a time');
  const embed = new MessageEmbed()
    .setTitle('Reminder')
    .setColor(randomColor)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setThumbnail(message.author.displayAvatarURL())
    .setDescription(
      `New reminder successfully created:\n**When:** ${formattedDate(
        Date.now() + totalTime,
      )}\n **Reminder**: ${reminder}`,
    );
  message.channel.send({ embeds: [embed] });

  if (currentReminderData)
    return currentReminderData.update({
      reminders: currentReminderData.reminders.concat([
        {
          message: reminder,
          time: Date.now() + totalTime,
          reminderId: currentReminderData.reminders.length + 1,
          channelId: message.channel.id,
        },
      ]),
    });

  const reminderHandler = new Reminder({
    userId: message.author.id,
    reminders: [
      {
        message: reminder,
        time: Date.now() + totalTime,
        reminderId: 1,
        channelId: message.channel.id,
      },
    ],
  });
  await reminderHandler.save();
};
