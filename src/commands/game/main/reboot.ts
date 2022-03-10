import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor, Subcategories } from '#constants/index';
import { currentLogo } from '#config';
import { Command } from '@sapphire/framework';

export default class Reboot extends Command {
  public override name = 'reboot';
  public override description = 'info on rebooting your in-game simulation';
  public override fullCategory = [Categories.game, Subcategories.main];

  public override sharedRun() {
    const embed = new MessageEmbed()
      .setTitle('Reboot')
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setDescription(
        '**Reboot\'s location:** You can find the "Simulation Reboot" by  clicking on the (metabit) bar under your currency (entropy/ideas).\n' +
          '**The importance of rebooting your simulation:** you gain metabits from your simulation, which in order to use them and unlock their potential you need to reboot your simulation. ' +
          'rebooting also offers a lot of speed boost and rewards',
      );
    return { embeds: [embed], files: [currentLogo] };
  }

  public async messageRun(message: Message) {
    await message.reply(this.sharedRun());
  }
}
