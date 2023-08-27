import { attachments, Category, emojis, randomColor, SubCategory } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';

export default class Trex extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'trex',
      description: 'Info on the T-rex',
      fullCategory: [Category.game, SubCategory.mesozoic],
    });
  }

  public override templateRun() {
    const embed = new EmbedBuilder()
      .setTitle(`${emojis.trexBadge}Tyrannosaurus Rex`)
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.url)
      .setDescription(
        'The T-Rex, the rightful king of the Mesozoic Valley, can be unlocked at Rank 26 in the Mesozoic Valley, which will also earn you an achievement called, "Birth of a Tyrant".',
      );
    return { embeds: [embed.toJSON()], files: [attachments.currentLogo] };
  }
}
