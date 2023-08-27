import { Category, randomColor, SubCategory, attachments } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';

export default class Prestige extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'prestige',
      description: 'info on the Mesozoic Valley Prestige System.',
      fullCategory: [Category.game, SubCategory.mesozoic],
    });
  }

  public override templateRun() {
    const embed = new EmbedBuilder()
      .setTitle('Mesozoic Valley Prestige')

      .setColor(randomColor)
      .setImage(attachments.prestige.url)
      .setThumbnail(attachments.currentLogo.url)
      .setDescription(
        'Prestige in the Mesozoic Valley is unlocked at rank 50, which is also the rank that is recommended to purchase the diamond geode. ' +
          'Prestige also allows you to keep your Mutagen.',
      )
      .setFooter({ text: 'Prestige goes brrr...' });
    return { embeds: [embed.toJSON()], files: [attachments.currentLogo, attachments.prestige] };
  }
}
