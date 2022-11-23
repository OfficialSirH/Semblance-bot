import { EmbedBuilder } from 'discord.js';
import { Category, randomColor } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';

export default class Changelog extends Command {
  public override name = 'changelog';
  public override description = 'Provides the latest changes to Semblance.';
  public override fullCategory = [Category.semblance];

  public override async sharedRun(interaction: Command['SharedBuilder']) {
    const changelogHandler = await interaction.client.db.information.findUnique({ where: { type: 'changelog' } });
    if (!changelogHandler) return 'No changelog found.';
    const embed = new EmbedBuilder()
      .setTitle('Changelog')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setColor(randomColor)
      .setDescription(changelogHandler.value);
    return { embeds: [embed] };
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
    });
  }
}
