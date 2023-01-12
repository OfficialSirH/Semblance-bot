import { attachments, Category, randomColor, SubCategory } from '#constants/index';
import { Command } from '#structures/Command';

export default class Simstats extends Command {
  public override name = 'simstats';
  public override description = 'guide for finding the simulation stats page in-game';
  public override category = [Category.game, SubCategory.main];

  public override sharedRun() {
    const embed = new EmbedBuilder()
      .setTitle('Simulation Statistics')
      .setThumbnail(attachments.currentLogo)
      .setColor(randomColor)
      .setImage(attachments.simStatsLocation)
      .setDescription(
        'Clicking your currency(Image 1) will open the Semblance/Reality Engine, which looking towards the left side of the engine will have a sliding button(Image 2) that will show your game stats.',
      );
    return {
      embeds: [embed],
      files: [attachments.currentLogo.attachment, attachments.simStatsLocation.attachment],
    };
  }
}
