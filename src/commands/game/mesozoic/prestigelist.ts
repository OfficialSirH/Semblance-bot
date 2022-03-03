import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { currentLogo, prestigeList } from '#config';
import { Categories, randomColor, Subcategories } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class PrestigeList extends Command {
  public override name = 'prestigelist';
  public override description = 'A list of the Mesozoic Valley Prestige ranks.';
  public override fullCategory = [Categories.game, Subcategories.mesozoic];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Mesozoic Valley Prestige List')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setImage(prestigeList.name)
      .setFooter({ text: 'Thanks to Hardik for this lovely list of Prestige :D' });
    return { embeds: [embed], files: [currentLogo, prestigeList] };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
