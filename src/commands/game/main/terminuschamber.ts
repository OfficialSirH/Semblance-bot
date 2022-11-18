import { type Message, EmbedBuilder } from 'discord.js';
import { attachments, Category, randomColor, Subcategory } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class TerminusChamber extends Command {
  public override name = 'terminuschamber';
  public override description = 'Details on how to obtain each node within the Terminus Chamber';
  public override fullCategory = [Category.game, Subcategory.main];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new EmbedBuilder()
      .setTitle('Terminus Chamber')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
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

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
