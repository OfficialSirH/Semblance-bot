import { Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';

export default class Changelog extends Command {
  public override name = 'changelog';
  public override description = 'Provides the latest changes to Semblance.';
  public override category = [Category.semblance];

  public override async sharedRun(interaction: Command['SharedBuilder']) {
    const changelogHandler = await interaction.client.db.information.findUnique({ where: { type: 'changelog' } });
    if (!changelogHandler) return 'No changelog found.';
    const embed = new EmbedBuilder()
      .setTitle('Changelog')
      .setAuthor(interaction.user)
      .setColor(randomColor)
      .setDescription(changelogHandler.value);
    return { embeds: [embed] };
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
    };
  }
}
