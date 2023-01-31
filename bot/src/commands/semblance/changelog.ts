import { Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';

export default class Changelog extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'changelog',
      description: 'Provides the latest changes to Semblance.',
      fullCategory: [Category.semblance],
    });
  }

  public override async templateRun() {
    const changelogHandler = await this.client.db.information.findUnique({ where: { type: 'changelog' } });
    if (!changelogHandler) return { content: 'No changelog found.' };
    const embed = new EmbedBuilder()
      .setTitle('Changelog')

      .setColor(randomColor)
      .setDescription(changelogHandler.value);
    return { embeds: [embed.toJSON()] };
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
    };
  }
}
