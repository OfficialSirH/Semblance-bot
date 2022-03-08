import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor, Subcategories } from '#constants/index';
import { currentLogo, terminusChamber } from '#config';
import { Command } from '@sapphire/framework';

export default class TerminusChamber extends Command {
  public override name = 'terminuschamber';
  public override description = 'Details on how to obtain each node within the Terminus Chamber';
  public override fullCategory = [Categories.game, Subcategories.main];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new MessageEmbed()
      .setTitle('Terminus Chamber')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setImage(terminusChamber.name)
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
      files: [currentLogo, terminusChamber],
    };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
