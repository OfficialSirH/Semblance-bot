import { type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Category, randomColor } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';

export default class PrivacyPolicy extends Command {
  public override name = 'privacypolicy';
  public override description = 'Get the privacy policy for Semblance.';
  public override fullCategory = [Category.semblance];

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    const embed = new EmbedBuilder()
      .setTitle('Privacy Policy')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setColor(randomColor)
      .setURL('https://github.com/OfficialSirH/Semblance-bot/blob/master/Privacy%20Policy.md');

    await interaction.reply({ embeds: [embed] });
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
    });
  }
}
