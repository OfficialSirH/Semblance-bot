import { type CommandInteraction, MessageAttachment, type User } from 'discord.js';
import { Categories, formattedDate, isUserInGuild } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { c2sGuildId } from '#config';

export default class BoostReward extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'boostreward',
      description: 'interact with booster rewards for users',
      fullCategory: [Categories.developer],
      preconditions: ['OwnerOnly'],
    });
  }

  public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'add': {
        const user = interaction.options.getUser('user');
        if (!user || !(await isUserInGuild(user, interaction.guild)))
          return interaction.reply({ content: 'invalid user', ephemeral: true });
        const days = interaction.options.getInteger('days') ?? 28;
        return addBooster(interaction, { user, days });
      }
      case 'edit': {
        const user = interaction.options.getUser('user');
        if (!user || !(await isUserInGuild(user, interaction.guild)))
          return interaction.reply({ content: 'invalid user', ephemeral: true });
        const days = interaction.options.getInteger('days');
        return editBooster(interaction, { user, days });
      }
      case 'remove': {
        const user = interaction.options.getUser('user');
        if (!user || !(await isUserInGuild(user, interaction.guild)))
          return interaction.reply({ content: 'invalid user', ephemeral: true });
        return removeBooster(interaction, user);
      }
      case 'list':
        return listBoosters(interaction);
      default:
        return interaction.reply('Invalid subcommand.');
    }
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        defaultPermission: false,
        options: [
          {
            name: 'add',
            description: 'add a user to the booster reward list',
            type: 'SUB_COMMAND',
            options: [
              {
                name: 'user',
                description: 'the user to add to the booster reward list',
                type: 'USER',
                required: true,
              },
              {
                name: 'days',
                description: 'the number of days till the user gets their reward (defaults to 28)',
                type: 'INTEGER',
              },
            ],
          },
          {
            name: 'edit',
            description: 'edit a user in the booster reward list',
            type: 'SUB_COMMAND',
            options: [
              {
                name: 'user',
                description: 'the user to edit in the booster reward list',
                type: 'USER',
                required: true,
              },
              {
                name: 'days',
                description: 'the number of days till the user gets their reward',
                type: 'INTEGER',
                required: true,
              },
            ],
          },
          {
            name: 'remove',
            description: 'remove a user from the booster reward list',
            type: 'SUB_COMMAND',
            options: [
              {
                name: 'user',
                description: 'the user to remove from the booster reward list',
                type: 'USER',
                required: true,
              },
            ],
          },
          {
            name: 'list',
            description: 'list all users in the booster reward list',
            type: 'SUB_COMMAND',
          },
        ],
      },
      {
        guildIds: [c2sGuildId],
        idHints: ['973689159548035123'],
      },
    );
  }
}

const addBooster = async (interaction: CommandInteraction<'cached'>, options: { user: User; days: number }) => {
  let boosterRewards = await interaction.client.db.boosterReward.findUnique({ where: { userId: options.user.id } });
  if (boosterRewards)
    return interaction.reply(
      `That user is already listed to receive an automated reward on ${formattedDate(
        boosterRewards.rewardingDate.valueOf(),
      )}`,
    );

  boosterRewards = await interaction.client.db.boosterReward.create({
    data: {
      userId: options.user.id,
      rewardingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * options.days),
    },
  });
  await interaction.reply(
    `That user will now receive an automated reward on ${formattedDate(boosterRewards.rewardingDate.valueOf())}`,
  );
};

const editBooster = async (interaction: CommandInteraction<'cached'>, options: { user: User; days: number }) => {
  let boosterRewards = await interaction.client.db.boosterReward.findUnique({ where: { userId: options.user.id } });
  if (!boosterRewards) return interaction.reply('That user is not listed to receive an automated reward');

  boosterRewards = await interaction.client.db.boosterReward.update({
    where: {
      userId: options.user.id,
    },
    data: {
      rewardingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * options.days),
    },
  });
  await interaction.reply(
    `The user's reward was successfully updated, they will now receive an automated reward on ${formattedDate(
      boosterRewards.rewardingDate.valueOf(),
    )}`,
  );
};

const removeBooster = async (interaction: CommandInteraction<'cached'>, user: User) => {
  const boosterRewards = await interaction.client.db.boosterReward.delete({ where: { userId: user.id } });
  if (!boosterRewards) return interaction.reply('That user is not listed to receive an automated reward');

  await interaction.reply('That user will no longer receive an automated reward');
};

const listBoosters = async (interaction: CommandInteraction<'cached'>) => {
  const boosterRewards = await interaction.client.db.boosterReward.findMany({});
  if (!boosterRewards.length) return interaction.reply('There are no booster rewards to list');

  interaction.reply({
    content: `Here's all ${boosterRewards.length} booster reward users`,
    files: [
      new MessageAttachment(
        Buffer.from(
          `${boosterRewards.reduce(
            (acc, cur) => (acc += `${cur.userId} - ${formattedDate(cur.rewardingDate.valueOf())}\n`),
            '',
          )}`,
        ),
        'boosterRewards.js',
      ),
    ],
  });
};
