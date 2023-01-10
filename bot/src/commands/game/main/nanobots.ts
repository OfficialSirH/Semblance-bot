import { EmbedBuilder } from 'discord.js';
import { attachments, Category, randomColor, Subcategory } from '#constants/index';
import { Command } from '#structures/Command';

export default class Nanobots extends Command {
  public override name = 'nanobots';
  public override description = 'Provides details on nanobots and whatever else about those cute critters';
  public override category = [Category.game, Subcategory.main];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const embed = new EmbedBuilder()
      .setTitle('Nanobots')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setImage(attachments.nanobots.name)
      .setDescription(
        [
          'Nanobots are little dudes that can help with either auto-upgrading or clicking. These little dudes are obtainable through rebooting and spending metabits for them, which you can buy up to 12(First Image).',
          'While ready(Image "ready"), the nanobots last for 2 minutes, which costs 2 darwinium to recharge them when they\'re in cooldown(Image "Cooldown"), and can be toggled between clicker(Image "Actively Clicking") or upgrader(Image "Actively Upgrading") mode.',
          'Depending on where your camera is on the tech tree, your nanobots will try to upgrade everything within your camera region, so whether you want your nanobots to upgrade something specific',
          "or you want to speed through the advancements you'll have to make sure your camera is covering the region or item you want upgraded.",
        ].join(' '),
      )
      .setFooter({
        text: 'Thanks to SampeDrako for creating this beautifully better designed image representing nanobots!',
      });
    return { embeds: [embed], files: [attachments.currentLogo.attachment, attachments.nanobots.attachment] };
  }
}
