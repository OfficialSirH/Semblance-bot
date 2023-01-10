import { EmbedBuilder } from 'discord.js';
import { attachments, Category, emojis, randomColor, Subcategory } from '#constants/index';
import { Command } from '#structures/Command';

export default class Trex extends Command {
  public override name = 'trex';
  public override description = 'Info on the T-rex';
  public override category = [Category.game, Subcategory.mesozoic];

  public override sharedRun() {
    const embed = new EmbedBuilder()
      .setTitle(`${emojis.trexBadge}Tyrannosaurus Rex`)
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setDescription(
        'The T-Rex, the rightful king of the Mesozoic Valley, can be unlocked at Rank 26 in the Mesozoic Valley, which will also earn you an achievement called, "Birth of a Tyrant".',
      );
    return { embeds: [embed], files: [attachments.currentLogo.attachment] };
  }
}
