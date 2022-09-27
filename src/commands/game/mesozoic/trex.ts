import { MessageEmbed, type Message } from 'discord.js';
import { attachments, Category, emojis, randomColor, Subcategory } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Trex extends Command {
  public override name = 'trex';
  public override description = 'Info on the T-rex';
  public override fullCategory = [Category.game, Subcategory.mesozoic];

  public override sharedRun() {
    const embed = new MessageEmbed()
      .setTitle(`${emojis.trexBadge}Tyrannosaurus Rex`)
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setDescription(
        'The T-Rex, the rightful king of the Mesozoic Valley, can be unlocked at Rank 26 in the Mesozoic Valley, which will also earn you an achievement called, "Birth of a Tyrant".',
      );
    return { embeds: [embed], files: [attachments.currentLogo] };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun());
  }
}
