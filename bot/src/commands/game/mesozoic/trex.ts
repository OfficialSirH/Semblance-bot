import { attachments, Category, emojis, randomColor, SubCategory } from '#constants/index';
import { Command } from '#structures/Command';

export default class Trex extends Command {
  public override name = 'trex';
  public override description = 'Info on the T-rex';
  public override category = [Category.game, SubCategory.mesozoic];

  public override sharedRun() {
    const embed = new EmbedBuilder()
      .setTitle(`${emojis.trexBadge}Tyrannosaurus Rex`)
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo)
      .setDescription(
        'The T-Rex, the rightful king of the Mesozoic Valley, can be unlocked at Rank 26 in the Mesozoic Valley, which will also earn you an achievement called, "Birth of a Tyrant".',
      );
    return { embeds: [embed.toJSON()], files: [attachments.currentLogo.attachment] };
  }
}
