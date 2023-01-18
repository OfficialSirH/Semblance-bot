import { Category, randomColor } from '#constants/index';
import { type APIChatInputApplicationCommandGuildInteraction, ApplicationCommandOptionType } from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import { EmbedBuilder } from '@discordjs/builders';
import { Command } from '#structures/Command';

export default class Avatar extends Command {
  public override name = 'avatar';
  public override description = 'Get the avatar of a user.';
  public override category = [Category.utility];

  public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    const user = options.getUser('user')
        ? await this.client.users.fetch(options.getUser('user', true).id)
        : interaction.member.user,
      author = interaction.member.user,
      embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Avatar`)
        .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL() })
        .setColor(randomColor)
        .setImage(user.displayAvatarURL());
    return this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
  }

  public override data() {
    return {
      command: {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user to get the avatar of.',
          },
        ],
      },
    };
  }
}
