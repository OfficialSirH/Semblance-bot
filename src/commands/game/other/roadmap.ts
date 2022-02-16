import { ActionRow, ButtonComponent, ButtonStyle, Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor, Subcategories } from '#constants/index';
import { roadMap, currentLogo } from '#config';
import { Command } from '@sapphire/framework';

export default class Roadmap extends Command {
  public override name = 'roadmap';
  public override description = 'details on the C2S Roadmap';
  public override fullCategory = [Categories.game, Subcategories.other];

  public override async messageRun(message: Message) {
    const embed = new Embed()
      .setTitle('Road Map')
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setImage(roadMap.name);
    const components = [
      new ActionRow().addComponents(
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'roadmap',
              action: 'testers',
            }),
          )
          .setStyle(ButtonStyle.Primary)
          .setLabel('Early Beyond Testers'),
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'roadmap',
              action: 'early-beyond',
            }),
          )
          .setStyle(ButtonStyle.Primary)
          .setLabel('Early Beyond Sneak Peeks'),
      ),
    ];
    await message.channel.send({ embeds: [embed], files: [currentLogo, roadMap], components });
  }
}
