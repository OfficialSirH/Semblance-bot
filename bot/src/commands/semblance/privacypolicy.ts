import { Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import type { FastifyReply } from 'fastify';

export default class PrivacyPolicy extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'privacypolicy',
      description: 'Get the privacy policy for Semblance.',
      fullCategory: [Category.semblance],
    });
  }

  public override async chatInputRun(res: FastifyReply) {
    const embed = new EmbedBuilder()
      .setTitle('Privacy Policy')

      .setColor(randomColor)
      .setURL('https://github.com/OfficialSirH/Semblance-bot/blob/master/Privacy%20Policy.md');

    await this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
    };
  }
}
