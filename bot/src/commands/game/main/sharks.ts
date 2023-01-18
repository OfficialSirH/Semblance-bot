import { attachments, Category, randomColor, SubCategory } from '#constants/index';
import { Command } from '#structures/Command';

export default class Sharks extends Command {
  public override name = 'sharks';
  public override description = 'info on sharks';
  public override category = [Category.game, SubCategory.main];

  public override sharedRun() {
    const embed = new EmbedBuilder()
      .setTitle('Sharks')
      .setColor(randomColor)
      .setImage(attachments.sharks)
      .setThumbnail(attachments.currentLogo)
      .setDescription(
        'There are six sharks within the game that can be unlocked within the daily rewards individually every 14 days, which takes 84 days to unlock all of them, which will give you the achievement, "Shark Week".\n They\'re unlocked in this order: \n' +
          '1. Leopard Shark \n 2. Whale Shark \n 3. Tiger Shark \n 4. Great White \n 5. Hammerhead \n 6. **MEGALODON!!**',
      );
    return { embeds: [embed.toJSON()], files: [attachments.currentLogo.attachment, attachments.sharks.attachment] };
  }
}
