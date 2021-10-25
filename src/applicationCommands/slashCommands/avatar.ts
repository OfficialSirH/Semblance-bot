import { MessageEmbed } from 'discord.js';
import type { User } from 'discord.js';
import { randomColor, getAvatar } from '#constants/index';
import type { SlashCommand } from '#lib/interfaces/Semblance';

export default {
  permissionRequired: 0,
  run: async (interaction, { client }) => {
    let user = interaction.options.getUser('user')
        ? await client.users.fetch(interaction.options.getUser('user').id)
        : (interaction.member.user as User),
      author = interaction.member.user as User,
      embed = new MessageEmbed()
        .setTitle(`${user.username}'s Avatar`)
        .setAuthor(`${author.tag}`, author.displayAvatarURL())
        .setColor(randomColor)
        .setImage(getAvatar(user));
    return interaction.reply({ embeds: [embed] });
  },
} as SlashCommand;
