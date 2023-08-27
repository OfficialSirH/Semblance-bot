import { Command } from '#structures/Command';
import { Category, avatarUrl, randomColor } from '#constants/index';
import { EmbedBuilder } from '@discordjs/builders';
import type { FastifyReply } from 'fastify';

export default class Invite extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'invite',
      description: 'Gets an invite link for the bot and support server.',
      fullCategory: [Category.semblance],
    });
  }

  public override async chatInputRun(res: FastifyReply) {
    const embed = new EmbedBuilder()
      .setTitle('Bot Invite')
      .setColor(randomColor)
      .setThumbnail(avatarUrl(this.client.user))
      .setDescription(
        `Invite me to your server be clicking [here](https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=274878295040&scope=bot+applications.commands).` +
          '\n\n[Semblance Support server](https://discord.gg/XFMaTn6taf)',
      )
      .setFooter({ text: 'Spread the word about Semblance!' });

    await this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
    };
  }
}
