import { Embed, type Message } from 'discord.js';
import { Categories, randomColor, Subcategories } from '#constants/index';
import { currentLogo, trexBadge } from '#config';
import { Command } from '@sapphire/framework';

export default class Trex extends Command {
  public override name = 'trex';
  public override description = 'Info on the T-rex';
  public override fullCategory = [Categories.game, Subcategories.mesozoic];

  public override sharedRun() {
    const embed = new Embed()
      .setTitle(`${trexBadge}Tyrannosaurus Rex`)
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setDescription(
        'The T-Rex, the rightful king of the Mesozoic Valley, can be unlocked at Rank 26 in the Mesozoic Valley, which will also earn you an achievement called, "Birth of a Tyrant".',
      );
    return { embeds: [embed], files: [currentLogo] };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun());
  }
}
