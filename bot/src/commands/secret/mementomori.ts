import { Category, randomColor, attachments } from '#constants/index';
import { Command } from '#structures/Command';

export default class Mementomori extends Command {
  public override name = 'mementomori';
  public override category = [Category.secret];

  public override async sharedRun(interaction: Command['SharedBuilder']) {
    const embed = new EmbedBuilder()
      .setTitle('Memento Mori')
      .setAuthor(interaction.user)
      .setColor(randomColor)
      .setImage(attachments.mementoMori)
      .setDescription('[The Goodbye](https://www.youtube.com/watch?v=aDQ3nfBbPWM)');
    return { embeds: [embed.toJSON()], files: [attachments.mementoMori.attachment], flags: MessageFlags.Ephemeral };
  }
}
