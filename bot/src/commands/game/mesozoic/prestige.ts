import { EmbedBuilder } from 'discord.js';
import { Category, randomColor, Subcategory, attachments } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Prestige extends Command {
  public override name = 'prestige';
  public override description = 'info on the Mesozoic Valley Prestige System.';
  public override fullCategory = [Category.game, Subcategory.mesozoic];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const embed = new EmbedBuilder()
      .setTitle('Mesozoic Valley Prestige')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setColor(randomColor)
      .setImage(attachments.prestige.name)
      .setThumbnail(attachments.currentLogo.name)
      .setDescription(
        'Prestige in the Mesozoic Valley is unlocked at rank 50, which is also the rank that is recommended to purchase the diamond geode. ' +
          'Prestige also allows you to keep your Mutagen.',
      )
      .setFooter({ text: 'Prestige goes brrr...' });
    return { embeds: [embed], files: [attachments.currentLogo.attachment, attachments.prestige.attachment] };
  }
}
