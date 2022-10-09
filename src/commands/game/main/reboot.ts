import { type Message, EmbedBuilder } from 'discord.js';
import { Category, randomColor, Subcategory, attachments } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Reboot extends Command {
  public override name = 'reboot';
  public override description = 'info on rebooting your in-game simulation';
  public override fullCategory = [Category.game, Subcategory.main];

  public override sharedRun() {
    const embed = new EmbedBuilder()
      .setTitle('Reboot')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setDescription(
        '**Reboot\'s location:** You can find the "Simulation Reboot" by  clicking on the (metabit) bar under your currency (entropy/ideas).\n' +
          '**The importance of rebooting your simulation:** you gain metabits from your simulation, which in order to use them and unlock their potential you need to reboot your simulation. ' +
          'rebooting also offers a lot of speed boost and rewards',
      );
    return { embeds: [embed], files: [attachments.currentLogo.attachment] };
  }

  public async messageRun(message: Message) {
    await message.reply(this.sharedRun());
  }
}
