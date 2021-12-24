import { MessageEmbed } from 'discord.js';
import type { User, CommandInteraction } from 'discord.js';
import { randomColor, timeInputRegex, formattedDate, timeInputToMs } from '#constants/index';
import type { TimeLengths } from '#lib/interfaces/remindme';
import type { Reminder, UserReminder } from '@prisma/client';
import type { SlashCommand } from '#lib/interfaces/Semblance';
import { handleReminder } from '#src/constants/models';
import { scheduleJob } from 'node-schedule';
import type { Semblance } from '#structures/Semblance';

export default {
  permissionRequired: 0,
  run: async (interaction, { client }) => {
    let action: string, commandFailed: boolean;
    try {
      action = interaction.options.getSubcommand(true);
    } catch (e) {
      commandFailed = true;
      interaction.reply({
        content: 'You must specify a subcommand.',
        ephemeral: true,
      });
    }
    if (commandFailed) return;
    switch (action) {
      case 'create':
        return create(interaction, client);
      case 'edit':
        return edit(interaction, client);
      case 'delete':
        return deleteReminder(interaction, client);
      case 'list':
        return list(interaction, client);
      default:
        return interaction.reply({
          content: 'You must specify a valid subcommand.',
          ephemeral: true,
        });
    }
  },
} as SlashCommand;

async function create(interaction: CommandInteraction, client: Semblance) {
  const timeAmount = timeInputRegex.exec(interaction.options.getString('length')),
    reminder = interaction.options.getString('reminder'),
    user = interaction.member.user as User;

  if (timeAmount == null)
    return interaction.reply({
      content: 'Your input for time is invalid, please try again.',
      ephemeral: true,
    });
  const {
    groups: { months = 0, weeks = 0, days = 0, hours = 0, minutes = 0 },
  } = timeAmount as TimeLengths;
  if ([months, weeks, days, hours, minutes].every(time => !time))
    return interaction.reply({
      content: 'Your input for time was invalid, please try again.',
      ephemeral: true,
    });

  const totalTime = timeInputToMs(months, weeks, days, hours, minutes);

  if (totalTime > 29030400000)
    return interaction.reply({
      content: 'You cannot create a reminder for longer than a year',
      ephemeral: true,
    });

  const currentReminderData = await client.db.reminder.findUnique({ where: { userId: user.id } });
  if (currentReminderData?.reminders.length >= 5)
    return interaction.reply({
      content: 'You cannot have more than 5 reminders at a time',
      ephemeral: true,
    });

  const embed = new MessageEmbed()
    .setTitle('Reminder')
    .setColor(randomColor)
    .setThumbnail(user.displayAvatarURL())
    .setDescription(
      `New reminder successfully created:\n**When:** ${formattedDate(
        Date.now() + totalTime,
      )}\n **Reminder**: ${reminder}`,
    )
    .setFooter(`Command called by ${user.tag}`, user.displayAvatarURL());
  await interaction.reply({ embeds: [embed] });

  if (currentReminderData) {
    client.db.reminder.update({
      where: { userId: user.id },
      data: {
        reminders: currentReminderData.reminders.concat([
          {
            message: reminder,
            time: Date.now() + totalTime,
            reminderId: currentReminderData.reminders.length + 1,
            channelId: interaction.channel.id,
          },
        ]),
      },
    });
    return scheduleJob(new Date((currentReminderData.reminders.at(-1) as unknown as UserReminder).time), () =>
      handleReminder(
        client,
        currentReminderData as unknown as Reminder,
        currentReminderData.reminders.at(-1) as unknown as UserReminder,
      ),
    );
  }

  // const reminderHandler = new Reminder({
  //   userId: user.id,
  //   reminders: [
  //     {
  //       message: reminder,
  //       time: Date.now() + totalTime,
  //       reminderId: 1,
  //       channelId: interaction.channel.id,
  //     },
  //   ],
  // });
  // await reminderHandler.save();
  const newReminder = await client.db.reminder.create({
    data: {
      userId: user.id,
      reminders: [
        {
          message: reminder,
          time: Date.now() + totalTime,
          reminderId: 1,
          channelId: interaction.channel.id,
        },
      ],
    },
  });
  scheduleJob(new Date((newReminder.reminders.at(0) as unknown as UserReminder).time), () =>
    handleReminder(client, newReminder as unknown as Reminder, newReminder.reminders.at(0) as unknown as UserReminder),
  );
}

async function edit(interaction: CommandInteraction, client: Semblance) {
  const user = interaction.member.user as User,
    currentReminderData = (await client.db.reminder.findUnique({ where: { userId: user.id } })) as unknown as Reminder;

  if (!currentReminderData)
    return interaction.reply({
      content: "You don't have any reminders to edit.",
      ephemeral: true,
    });

  const reminderId = interaction.options.getInteger('reminderid'),
    reminder = interaction.options.getString('reminder'),
    length = interaction.options.getString('length');

  if (!reminder && !length)
    return interaction.reply({
      content: 'You must specify a reminder or a length',
      ephemeral: true,
    });
  if (reminderId > currentReminderData.reminders.length)
    return interaction.reply({
      content: 'You must specify a valid reminder ID',
      ephemeral: true,
    });

  let timeAmount: RegExpExecArray,
    totalTime = 0;
  if (length) {
    timeAmount = timeInputRegex.exec(length);
    const {
      groups: { months = 0, weeks = 0, days = 0, hours = 0, minutes = 0 },
    } = timeAmount as TimeLengths;
    if ([months, weeks, days, hours, minutes].every(time => !time))
      return interaction.reply({
        content: 'Your input for time was invalid, please try again.',
        ephemeral: true,
      });
    totalTime = timeInputToMs(months, weeks, days, hours, minutes);
  }

  const updatedReminder = {} as UserReminder;

  updatedReminder.message = reminder ? reminder : currentReminderData.reminders[reminderId - 1].message;
  if (length) updatedReminder.time = new Date(Date.now() + totalTime);
  updatedReminder.reminderId = reminderId;
  updatedReminder.channelId = currentReminderData.reminders.find(r => r.reminderId === reminderId).channelId;

  // await currentReminderData.update({
  //   reminders: currentReminderData.reminders.map(reminder => {
  //     return reminder.reminderId == reminderId ? updatedReminder : reminder;
  //   }),
  // });
  const updatedReminderData = await client.db.reminder.update({
    where: { userId: user.id },
    data: {
      reminders: currentReminderData.reminders.map(reminder => {
        return (reminder.reminderId == reminderId ? updatedReminder : reminder) as object;
      }),
    },
  });

  if (!updatedReminderData)
    return interaction.reply({
      content: 'An error occurred while updating your reminder',
      ephemeral: true,
    });

  const embed = new MessageEmbed()
    .setTitle('Edited Reminder')
    .setColor(randomColor)
    .setThumbnail(user.displayAvatarURL())
    .setDescription(
      `Reminder successfully edited:\n**When:** ${formattedDate(updatedReminder.time.valueOf())}\n **Reminder**: ${
        updatedReminder.message
      }`,
    )
    .setFooter(`Command called by ${user.tag}`, user.displayAvatarURL());
  await interaction.reply({ embeds: [embed] });
}

async function deleteReminder(interaction: CommandInteraction, client: Semblance) {
  const user = interaction.member.user as User,
    reminderId = interaction.options.getInteger('reminderid'),
    currentReminderData = (await client.db.reminder.findUnique({
      where: { userId: user.id },
    })) as unknown as Reminder;

  if (!currentReminderData)
    return interaction.reply({
      content: "You don't have any reminders to delete.",
      ephemeral: true,
    });
  if (reminderId > currentReminderData.reminders.length)
    return interaction.reply({
      content: 'You must specify a valid reminder ID',
      ephemeral: true,
    });

  const deletedReminder = currentReminderData.reminders.find(reminder => reminder.reminderId == reminderId);
  if (currentReminderData.reminders.length == 1) await client.db.reminder.delete({ where: { userId: user.id } });
  else
    await client.db.reminder.update({
      where: { userId: user.id },
      data: {
        reminders: currentReminderData.reminders
          .filter(reminder => reminder.reminderId != reminderId)
          .map((reminder, index) => {
            reminder.reminderId = index + 1;
            return reminder as object;
          }),
      },
    });

  const embed = new MessageEmbed()
    .setTitle('Deleted Reminder')
    .setColor(randomColor)
    .setThumbnail(user.displayAvatarURL())
    .setDescription(`Your reminder to remind you about: ${deletedReminder.message}\n has been deleted successfully`)
    .setFooter(`Command called by ${user.tag}`, user.displayAvatarURL());
  await interaction.reply({ embeds: [embed] });
}

async function list(interaction: CommandInteraction, client: Semblance) {
  const user = interaction.member.user as User,
    currentReminderData = (await client.db.reminder.findUnique({
      where: { userId: user.id },
    })) as unknown as Reminder;

  if (!currentReminderData)
    return interaction.reply({
      content: "You don't have any reminders.",
      ephemeral: true,
    });

  const embed = new MessageEmbed()
    .setTitle('Reminder List')
    .setColor(randomColor)
    .setThumbnail(user.displayAvatarURL())
    .setDescription(
      currentReminderData.reminders
        .map(
          reminder =>
            `**Reminder ID:** ${reminder.reminderId}\n**When:** ${formattedDate(
              reminder.time.valueOf(),
            )}\n**Reminder:** ${reminder.message}`,
        )
        .join('\n\n'),
    )
    .setFooter(`Command called by ${user.tag}`, user.displayAvatarURL());
  await interaction.reply({ embeds: [embed] });
}
