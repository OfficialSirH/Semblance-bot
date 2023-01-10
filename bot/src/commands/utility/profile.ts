import {
  EmbedBuilder,
  GuildMember,
  type User,
  type ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} from 'discord.js';
import { Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';

export default class Profile extends Command {
  public override name = 'profile';
  public override description = 'Get the profile of a user.';
  public override category = [Category.utility];

  public override async chatInputRun(res: FastifyReply, interaction: APIApplicationCommandInteraction) {
    const user = interaction.options.getUser('user');
    let member: GuildMember | null;
    if (!user) member = interaction.member;
    else
      member =
        user instanceof GuildMember
          ? user
          : await interaction.guild.members.fetch({ user: user.id, cache: false }).catch(() => null);

    if (member) return interaction.reply(guildProfileEmbed(member));
    return interaction.reply(userProfileEmbed(interaction, user as User));
  }

  public override data() {
    return {
      command: {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'user',
            description: 'The user to get the profile of.',
            type: ApplicationCommandOptionType.User,
          },
        ],
      },
    };
  }
}

function guildProfileEmbed(member: GuildMember) {
  let accountCreated = `${member.user.createdAt}`;
  accountCreated = `${accountCreated.substring(0, 16)}(${daysAgo(member.user.createdAt)})`;
  let accountJoined = `${member.joinedAt}`;
  accountJoined = `${accountJoined.substring(0, 16)}(${member.joinedAt ? daysAgo(member.joinedAt) : 'N/A'})`;
  const embed = new EmbedBuilder()
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

function userProfileEmbed(interaction: Command['SharedBuilder'], user: User) {
  const accountCreated = `${interaction.user.createdAt.toString().substring(0, 16)}(${daysAgo(user.createdTimestamp)})`;
  const embed = new EmbedBuilder()
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
