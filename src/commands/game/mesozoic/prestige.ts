import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { currentLogo, prestige } from '#config';
import { Categories, randomColor, Subcategories } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Prestige extends Command {
  public override name = 'prestige';
  public override description = 'info on the Mesozoic Valley Prestige System.';
  public override fullCategory = [Categories.game, Subcategories.mesozoic];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Mesozoic Valley Prestige')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setImage(prestige.name)
      .setThumbnail(currentLogo.name)
      .setDescription(
        'Prestige in the Mesozoic Valley is unlocked at rank 50, which is also the rank that is recommended to purchase the diamond geode. ' +
          'Prestige also allows you to keep your Mutagen.',
      )
      .setFooter({ text: 'Prestige goes brrr...' });
    return { embeds: [embed], files: [currentLogo, prestige] };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
