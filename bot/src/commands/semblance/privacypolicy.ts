import { Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';

export default class PrivacyPolicy extends Command {
  public override name = 'privacypolicy';
  public override description = 'Get the privacy policy for Semblance.';
  public override category = [Category.semblance];

  public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('Privacy Policy')
      .setAuthor(interaction.user)
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
