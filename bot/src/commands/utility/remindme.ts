import { randomColor, formattedDate, Category } from '#constants/index';
import type { Reminder, UserReminder, Prisma } from '@prisma/client';
import { handleReminder } from '#constants/models';
import { scheduleJob } from 'node-schedule';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import {
  type APIChatInputApplicationCommandGuildInteraction,
  MessageFlags,
  ApplicationCommandOptionType,
  type RESTPostAPIApplicationCommandsJSONBody,
  type APIApplicationCommandAutocompleteInteraction,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import type { InteractionOptionResolver } from '#structures/InteractionOptionResolver';

const MAX_TIME = 29030400000;
const MAX_REMINDERS = 5;
const MILLISECONDS_TO_MINUTES = 1000 * 60;

export default class RemindMe extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'remindme',
      description: 'create reminders for yourself',
      fullCategory: [Category.utility],
    });
  }

  public override async chatInputRun(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const action = options.getSubcommand();

    switch (action) {
      case 'create':
        return this.create(res, interaction, options);
      case 'edit':
        return this.edit(res, interaction, options);
      case 'delete':
        return this.deleteReminder(res, interaction, options);
      case 'list':
        return this.list(res, interaction);
      default:
        return this.client.api.interactions.reply(res, {
          content: 'You must specify a valid subcommand.',
          flags: MessageFlags.Ephemeral,
        });
    }
  }

  public override async autocompleteRun(
    reply: FastifyReply,
    _interaction: APIApplicationCommandAutocompleteInteraction,
    options: InteractionOptionResolver,
  ) {
    const focusedOption = options.getFocused() as number;
    const inputtedAmount = focusedOption < 1 ? 1 : focusedOption;

    await this.client.api.interactions.autocomplete(reply, [
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
    ]);
  }

  public override data() {
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
    return {
      command: {
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
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
    };
  }

  async create(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const timeAmount = options.getInteger('amount', true) * MILLISECONDS_TO_MINUTES,
      reminder = options.getString('reminder', true),
      user = interaction.member.user;

    if (timeAmount > MAX_TIME)
      return this.client.api.interactions.reply(res, {
        content: 'You cannot create a reminder for longer than a year',
        flags: MessageFlags.Ephemeral,
      });

    const currentReminderData = await this.client.db.reminder.findUnique({ where: { userId: user.id } });
    if (currentReminderData && currentReminderData?.reminders.length >= MAX_REMINDERS)
      return this.client.api.interactions.reply(res, {
        content: `You cannot have more than ${MAX_REMINDERS} reminders at a time`,
        flags: MessageFlags.Ephemeral,
      });

    const embed = new EmbedBuilder()
      .setTitle('Reminder')
      .setColor(randomColor)
      .setDescription(
        `New reminder successfully created:\n**When:** ${formattedDate(
          Date.now() + timeAmount,
        )}\n **Reminder**: ${reminder}`,
      );
    await this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });

    if (currentReminderData) {
      this.client.db.reminder.update({
        where: { userId: user.id },
        data: {
          reminders: currentReminderData.reminders.concat([
            {
              message: reminder,
              time: Date.now() + timeAmount,
              reminderId: currentReminderData.reminders.length + 1,
              channelId: interaction.channel.id,
            },
          ]) as Prisma.InputJsonValue[],
        },
      });
      return scheduleJob(new Date((currentReminderData.reminders.at(-1) as unknown as UserReminder).time), () =>
        handleReminder(
          this.client,
          currentReminderData as unknown as Reminder,
          currentReminderData.reminders.at(-1) as unknown as UserReminder,
        ),
      );
    }

    const newReminder = await this.client.db.reminder.create({
      data: {
        userId: user.id,
        reminders: [
          {
            message: reminder,
            time: Date.now() + timeAmount,
            reminderId: 1,
            channelId: interaction.channel_id,
          },
        ],
      },
    });
    scheduleJob(new Date((newReminder.reminders.at(0) as unknown as UserReminder).time), () =>
      handleReminder(
        this.client,
        newReminder as unknown as Reminder,
        newReminder.reminders.at(0) as unknown as UserReminder,
      ),
    );
  }

  async edit(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const user = interaction.member.user,
      currentReminderData = (await this.client.db.reminder.findUnique({
        where: { userId: user.id },
      })) as unknown as Reminder;

    if (!currentReminderData)
      return this.client.api.interactions.reply(res, {
        content: "You don't have any reminders to edit.",
        flags: MessageFlags.Ephemeral,
      });

    const reminderId = options.getInteger('reminderid', true),
      reminder = options.getString('reminder'),
      amount = options.getInteger('amount') || 0 * MILLISECONDS_TO_MINUTES;

    if (!reminder && !amount)
      return this.client.api.interactions.reply(res, {
        content: 'You must specify either a reminder or an amount of time to apply an edit.',
        flags: MessageFlags.Ephemeral,
      });
    if (reminderId > currentReminderData.reminders.length)
      return this.client.api.interactions.reply(res, {
        content: 'You must specify a valid reminder ID',
        flags: MessageFlags.Ephemeral,
      });

    const updatedReminder = {} as UserReminder;

    updatedReminder.message = reminder ? reminder : currentReminderData.reminders[reminderId - 1].message;
    updatedReminder.time = amount ? new Date(Date.now() + amount) : currentReminderData.reminders[reminderId - 1].time;
    updatedReminder.reminderId = reminderId;
    updatedReminder.channelId = currentReminderData.reminders.find(r => r.reminderId === reminderId)
      ?.channelId as string;

    const updatedReminderData = await this.client.db.reminder.update({
      where: { userId: user.id },
      data: {
        reminders: currentReminderData.reminders.map(reminder => {
          return (reminder.reminderId == reminderId ? updatedReminder : reminder) as object;
        }),
      },
    });

    if (!updatedReminderData)
      return this.client.api.interactions.reply(res, {
        content: 'An error occurred while updating your reminder',
        flags: MessageFlags.Ephemeral,
      });

    const embed = new EmbedBuilder()
      .setTitle('Edited Reminder')
      .setColor(randomColor)
      .setDescription(
        `Reminder successfully edited:\n**When:** ${formattedDate(updatedReminder.time.valueOf())}\n **Reminder**: ${
          updatedReminder.message
        }`,
      );
    await this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
  }

  async deleteReminder(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const user = interaction.member.user,
      reminderId = options.getInteger('reminderid', true),
      currentReminderData = (await this.client.db.reminder.findUnique({
        where: { userId: user.id },
      })) as unknown as Reminder;

    if (!currentReminderData)
      return this.client.api.interactions.reply(res, {
        content: "You don't have any reminders to delete.",
        flags: MessageFlags.Ephemeral,
      });
    if (reminderId > currentReminderData.reminders.length)
      return this.client.api.interactions.reply(res, {
        content: 'You must specify a valid reminder ID',
        flags: MessageFlags.Ephemeral,
      });

    const deletedReminder = currentReminderData.reminders.find(
      reminder => reminder.reminderId == reminderId,
    ) as UserReminder;
    if (currentReminderData.reminders.length == 1) await this.client.db.reminder.delete({ where: { userId: user.id } });
    else
      await this.client.db.reminder.update({
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
      .setDescription(`Your reminder to remind you about: ${deletedReminder.message}\n has been deleted successfully`);
    await this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
  }

  async list(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    const user = interaction.member.user,
      currentReminderData = (await this.client.db.reminder.findUnique({
        where: { userId: user.id },
      })) as unknown as Reminder;

    if (!currentReminderData)
      return this.client.api.interactions.reply(res, {
        content: "You don't have any reminders.",
        flags: MessageFlags.Ephemeral,
      });

    const embed = new EmbedBuilder()
      .setTitle('Reminder List')
      .setColor(randomColor)
      .setDescription(
        currentReminderData.reminders
          .map(
            reminder =>
              `**Reminder ID:** ${reminder.reminderId}\n**When:** ${formattedDate(
                reminder.time.valueOf(),
              )}\n**Reminder:** ${reminder.message}`,
          )
          .join('\n\n'),
      );
    await this.client.api.interactions.reply(res, { embeds: [embed.toJSON()], flags: MessageFlags.Ephemeral });
  }
}
