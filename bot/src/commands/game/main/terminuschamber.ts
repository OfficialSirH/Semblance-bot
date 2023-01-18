import { attachments, Category, randomColor, SubCategory } from '#constants/index';
import { Command } from '#structures/Command';

export default class TerminusChamber extends Command {
  public override name = 'terminuschamber';
  public override description = 'Details on how to obtain each node within the Terminus Chamber';
  public override category = [Category.game, SubCategory.main];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const embed = new EmbedBuilder()
      .setTitle('Terminus Chamber')
      .setAuthor(interaction.user)
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo)
      .setImage(attachments.terminusChamber)
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
      embeds: [embed.toJSON()],
      files: [attachments.currentLogo.attachment, attachments.terminusChamber.attachment],
    };
  }
}
