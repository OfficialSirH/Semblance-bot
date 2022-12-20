import { type ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType } from 'discord.js';
import { randomColor, formattedDate, Category } from '#constants/index';
import type { Reminder, UserReminder } from '@prisma/client';
import { handleReminder } from '#constants/models';
import { scheduleJob } from 'node-schedule';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import type {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteractionDataIntegerOption,
} from 'discord-api-types/v9';

const MAX_TIME = 29030400000;
const MAX_REMINDERS = 5;
const MILLISECONDS_TO_MINUTES = 1000 * 60;

export default class RemindMe extends Command {
  public override name = 'remindme';
  public override description = 'create reminders for yourself';
  public override fullCategory = [Category.utility];

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    const action = interaction.options.getSubcommand();

    switch (action) {
      case 'create':
        return create(interaction);
      case 'edit':
        return edit(interaction);
      case 'delete':
        return deleteReminder(interaction);
      case 'list':
        return list(interaction);
      default:
        return interaction.reply({
          content: 'You must specify a valid subcommand.',
          ephemeral: true,
        });
    }
  }

  public override async autocomplete(interaction: APIApplicationCommandAutocompleteInteraction) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const focusedOption = interaction.data.options.find(
      option => (option as APIApplicationCommandInteractionDataIntegerOption).focused,
    )! as APIApplicationCommandInteractionDataIntegerOption;

    const inputtedAmount = focusedOption.value < 1 ? 1 : focusedOption.value;

    return [
      {
        name: `${inputtedAmount} minute(s)`,
        value: inputtedAmount,
      },
      {
        name: `${inputtedAmount} hour(s)`,
        value: inputtedAmount * 60,
      },
      {
        name: `${inputtedAmount} day(s)`,
        value: inputtedAmount * 60 * 24,
      },
      {
        name: `${inputtedAmount} week(s)`,
        value: inputtedAmount * 60 * 24 * 7,
      },
      {
        name: `${inputtedAmount} month(s)`,
        value: inputtedAmount * 60 * 24 * 30,
      },
    ];
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    const reminderIdChoices = [
      {
        name: '5',
        value: 5,
      },
      {
        name: '4',
        value: 4,
      },
      {
        name: '3',
        value: 3,
      },
      {
        name: '2',
        value: 2,
      },
      {
        name: '1',
        value: 1,
      },
    ];
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'create',
          description: 'create a reminder',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'amount',
              description: 'the amount of time to wait before the reminder',
              type: ApplicationCommandOptionType.Integer,
              autocomplete: true,
              required: true,
            },
            {
              name: 'reminder',
              description: 'the reminder to be sent',
              type: ApplicationCommandOptionType.String,
              required: true,
            },
          ],
        },
        {
          name: 'edit',
          description: 'edit a reminder',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'reminderid',
              description: 'the id of the reminder to edit',
              type: ApplicationCommandOptionType.Integer,
              choices: reminderIdChoices,
              required: true,
            },
            {
              name: 'amount',
              description: 'the amount of time to wait before the reminder',
              type: ApplicationCommandOptionType.Integer,
              autocomplete: true,
            },
            {
              name: 'reminder',
              description: 'the reminder to be sent',
              type: ApplicationCommandOptionType.String,
            },
          ],
        },
        {
          name: 'delete',
          description: 'delete a reminder',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'reminderid',
              description: 'the id of the reminder to delete',
              type: ApplicationCommandOptionType.Integer,
              choices: reminderIdChoices,
              required: true,
            },
          ],
        },
        {
          name: 'list',
          description: 'list all of your reminders',
          type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    });
  }
}

async function create(interaction: ChatInputCommandInteraction<'cached'>) {
  const timeAmount = interaction.options.getInteger('amount', true) * MILLISECONDS_TO_MINUTES,
    reminder = interaction.options.getString('reminder', true),
    user = interaction.member.user;

  if (timeAmount > MAX_TIME)
    return interaction.reply({
      content: 'You cannot create a reminder for longer than a year',
      ephemeral: true,
    });

  const currentReminderData = await interaction.client.db.reminder.findUnique({ where: { userId: user.id } });
  if (currentReminderData && currentReminderData?.reminders.length >= MAX_REMINDERS)
    return interaction.reply({
      content: `You cannot have more than ${MAX_REMINDERS} reminders at a time`,
      ephemeral: true,
    });

  const embed = new EmbedBuilder()
    .setTitle('Reminder')
    .setColor(randomColor)
    .setThumbnail(user.displayAvatarURL())
    .setDescription(
      `New reminder successfully created:\n**When:** ${formattedDate(
        Date.now() + timeAmount,
      )}\n **Reminder**: ${reminder}`,
    )
    .setFooter({ text: `Command called by ${user.tag}`, iconURL: user.displayAvatarURL() });
  await interaction.reply({ embeds: [embed] });

  if (currentReminderData) {
    interaction.client.db.reminder.update({
      where: { userId: user.id },
      data: {
        reminders: currentReminderData.reminders.concat([
          {
            message: reminder,
            time: Date.now() + timeAmount,
            reminderId: currentReminderData.reminders.length + 1,
            channelId: interaction.channel?.id,
          },
        ]),
      },
    });
    return scheduleJob(new Date((currentReminderData.reminders.at(-1) as unknown as UserReminder).time), () =>
      handleReminder(
        interaction.client,
        currentReminderData as unknown as Reminder,
        currentReminderData.reminders.at(-1) as unknown as UserReminder,
      ),
    );
  }

  const newReminder = await interaction.client.db.reminder.create({
    data: {
      userId: user.id,
      reminders: [
        {
          message: reminder,
          time: Date.now() + timeAmount,
          reminderId: 1,
          channelId: interaction.channel?.id,
        },
      ],
    },
  });
  scheduleJob(new Date((newReminder.reminders.at(0) as unknown as UserReminder).time), () =>
    handleReminder(
      interaction.client,
      newReminder as unknown as Reminder,
      newReminder.reminders.at(0) as unknown as UserReminder,
    ),
  );
}

async function edit(interaction: ChatInputCommandInteraction<'cached'>) {
  const user = interaction.member.user,
    currentReminderData = (await interaction.client.db.reminder.findUnique({
      where: { userId: user.id },
    })) as unknown as Reminder;

  if (!currentReminderData)
    return interaction.reply({
      content: "You don't have any reminders to edit.",
      ephemeral: true,
    });

  const reminderId = interaction.options.getInteger('reminderid', true),
    reminder = interaction.options.getString('reminder'),
    amount = interaction.options.getInteger('amount') || 0 * MILLISECONDS_TO_MINUTES;

  if (!reminder && !amount)
    return interaction.reply({
      content: 'You must specify either a reminder or an amount of time to apply an edit.',
      ephemeral: true,
    });
  if (reminderId > currentReminderData.reminders.length)
    return interaction.reply({
      content: 'You must specify a valid reminder ID',
      ephemeral: true,
    });

  const updatedReminder = {} as UserReminder;

  updatedReminder.message = reminder ? reminder : currentReminderData.reminders[reminderId - 1].message;
  updatedReminder.time = amount ? new Date(Date.now() + amount) : currentReminderData.reminders[reminderId - 1].time;
  updatedReminder.reminderId = reminderId;
  updatedReminder.channelId = currentReminderData.reminders.find(r => r.reminderId === reminderId)?.channelId as string;

  const updatedReminderData = await interaction.client.db.reminder.update({
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

  const embed = new EmbedBuilder()
    .setTitle('Edited Reminder')
    .setColor(randomColor)
    .setThumbnail(user.displayAvatarURL())
    .setDescription(
      `Reminder successfully edited:\n**When:** ${formattedDate(updatedReminder.time.valueOf())}\n **Reminder**: ${
        updatedReminder.message
      }`,
    )
    .setFooter({ text: `Command called by ${user.tag}`, iconURL: user.displayAvatarURL() });
  await interaction.reply({ embeds: [embed] });
}

async function deleteReminder(interaction: ChatInputCommandInteraction<'cached'>) {
  const user = interaction.member.user,
    reminderId = interaction.options.getInteger('reminderid', true),
    currentReminderData = (await interaction.client.db.reminder.findUnique({
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

  const deletedReminder = currentReminderData.reminders.find(
    reminder => reminder.reminderId == reminderId,
  ) as UserReminder;
  if (currentReminderData.reminders.length == 1)
    await interaction.client.db.reminder.delete({ where: { userId: user.id } });
  else
    await interaction.client.db.reminder.update({
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

  const embed = new EmbedBuilder()
    .setTitle('Deleted Reminder')
    .setColor(randomColor)
    .setThumbnail(user.displayAvatarURL())
    .setDescription(`Your reminder to remind you about: ${deletedReminder.message}\n has been deleted successfully`)
    .setFooter({ text: `Command called by ${user.tag}`, iconURL: user.displayAvatarURL() });
  await interaction.reply({ embeds: [embed] });
}

async function list(interaction: ChatInputCommandInteraction<'cached'>) {
  const user = interaction.member.user,
    currentReminderData = (await interaction.client.db.reminder.findUnique({
      where: { userId: user.id },
    })) as unknown as Reminder;

  if (!currentReminderData)
    return interaction.reply({
      content: "You don't have any reminders.",
      ephemeral: true,
    });

  const embed = new EmbedBuilder()
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
    .setFooter({ text: `Command called by ${user.tag}`, iconURL: user.displayAvatarURL() });
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
