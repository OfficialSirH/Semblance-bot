import {
  type Message,
  GuildMember,
  type User,
  type ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} from 'discord.js';
import { Embed } from 'discord.js';
import { Categories, randomColor } from '#constants/index';
import type { ApplicationCommandRegistry, Args } from '@sapphire/framework';
import { Command } from '@sapphire/framework';

export default class Profile extends Command {
  public override name = 'profile';
  public override description = 'Get the profile of a user.';
  public override fullCategory = [Categories.utility];

  public override async messageRun(message: Message, args: Args) {
    const userResolve = await args.pickResult('user');
    let user: User, member: GuildMember;
    if (!userResolve.success) member = message.member;
    else {
      user = userResolve.value;
      member =
        user instanceof GuildMember
          ? user
          : await message.guild.members.fetch({ user: user.id, cache: false }).catch(() => null);
    }

    if (member) return message.reply(guildProfileEmbed(message, member));
    return message.reply(userProfileEmbed(message, user));
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    const user = interaction.options.getUser('user');
    let member: GuildMember;
    if (!user) member = interaction.member;
    else
      member =
        user instanceof GuildMember ? user : await interaction.guild.members.fetch({ user: user.id, cache: false });

    if (member) return interaction.reply(guildProfileEmbed(interaction, member));
    return interaction.reply(userProfileEmbed(interaction, user));
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'user',
          description: 'The user to get the profile of.',
          type: ApplicationCommandOptionType.User,
        },
      ],
    });
  }
}

function guildProfileEmbed(builder: Command['SharedBuilder'], member: GuildMember) {
  let accountCreated = `${member.user.createdAt}`;
  accountCreated = `${accountCreated.substring(0, 16)}(${daysAgo(member.user.createdAt)})`;
  let accountJoined = `${member.joinedAt}`;
  accountJoined = `${accountJoined.substring(0, 16)}(${daysAgo(member.joinedAt)})`;
  const embed = new Embed()
    .setTitle('Guild User Profile')
    .setDescription(`User data for ${member}:`)
    .setColor(randomColor)
    .setThumbnail(member.user.displayAvatarURL())
    .addFields(
      { name: 'Username', value: member.user.tag, inline: true },
      { name: 'Discriminator', value: member.user.discriminator, inline: true },
      { name: 'Bot', value: member.user.bot.toString(), inline: true },
      { name: 'User Id', value: member.id, inline: true },
      {
        name: 'Highest Rank',
        value: member.roles.highest.toString(),
        inline: true,
      },
      { name: 'Created', value: accountCreated, inline: true },
      { name: 'Joined', value: accountJoined, inline: true },
    );
  return { embeds: [embed] };
}

function userProfileEmbed(builder: Command['SharedBuilder'], user: User) {
  const cmdCaller = 'user' in builder ? builder.user : builder.author;
  const accountCreated = `${cmdCaller.createdAt.toString().substring(0, 16)}(${daysAgo(user.createdTimestamp)})`;
  const embed = new Embed()
    .setTitle('User Profile')
    .setDescription(`User data for ${user}:`)
    .setColor(randomColor)
    .setThumbnail(user.displayAvatarURL())
    .addFields(
      { name: 'Username', value: user.tag, inline: true },
      { name: 'Discriminator', value: user.discriminator, inline: true },
      { name: 'Bot', value: user.bot.toString(), inline: true },
      { name: 'User Id', value: user.id, inline: true },
      { name: 'Created', value: accountCreated, inline: true },
    );
  return { embeds: [embed] };
}

function daysAgo(date: Date | number) {
  const msToDays = 1000 * 60 * 60 * 24;
  return `${Math.round((Date.now() - (date as number)) / msToDays)} days ago`;
}
