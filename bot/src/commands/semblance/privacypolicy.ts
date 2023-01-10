import { type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';

export default class PrivacyPolicy extends Command {
  public override name = 'privacypolicy';
  public override description = 'Get the privacy policy for Semblance.';
  public override category = [Category.semblance];

  public override async chatInputRun(res: FastifyReply, interaction: APIApplicationCommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('Privacy Policy')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setColor(randomColor)
      .setURL('https://github.com/OfficialSirH/Semblance-bot/blob/master/Privacy%20Policy.md');

    await interaction.reply({ embeds: [embed] });
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
    };
  }
}
