import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor, Subcategories } from '#constants/index';
import { currentLogo, simStatsLocation } from '#config';
import { Command } from '@sapphire/framework';

export default class Simstats extends Command {
  public override name = 'simstats';
  public override description = 'guide for finding the simulation stats page in-game';
  public override fullCategory = [Categories.game, Subcategories.main];

  public override sharedRun() {
    const embed = new MessageEmbed()
      .setTitle('Simulation Statistics')
      .setThumbnail(currentLogo.name)
      .setColor(randomColor)
      .setImage(simStatsLocation.name)
      .setDescription(
        'Clicking your currency(Image 1) will open the Semblance/Reality Engine, which looking towards the left side of the engine will have a sliding button(Image 2) that will show your game stats.',
      );
    return {
      embeds: [embed],
      files: [currentLogo, simStatsLocation],
    };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun());
  }
}
