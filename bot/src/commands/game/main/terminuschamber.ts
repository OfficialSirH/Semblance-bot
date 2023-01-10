import { EmbedBuilder } from 'discord.js';
import { attachments, Category, randomColor, Subcategory } from '#constants/index';
import { Command } from '#structures/Command';

export default class TerminusChamber extends Command {
  public override name = 'terminuschamber';
  public override description = 'Details on how to obtain each node within the Terminus Chamber';
  public override category = [Category.game, Subcategory.main];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const embed = new EmbedBuilder()
      .setTitle('Terminus Chamber')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setImage(attachments.terminusChamber.name)
      .setDescription(
        [
          '**Yellow Cube** - ||Explore the Mesozoic Valley||',
          '**Purple Cube** - ||Unlock Singularity for the first time||',
          '**Light Pink Cube** - ||Unlock the human brain||',
          '**Light Blue Cube** - ||Obtain/Evolve Neoaves||',
          '**Blue Cube** - ||Unlock Cetaceans||',
          '**Lime Green Cube** - ||Unlock Crocodilians||',
          '**Orange Cube** - ||Unlock Feliforms||',
          '**Red Cube** - ||Terraform Mars||',
        ].join('\n'),
      );
    return {
      embeds: [embed],
      files: [attachments.currentLogo.attachment, attachments.terminusChamber.attachment],
    };
  }
}
