import { Categories, gameTransferPages, randomColor, Subcategories } from '#constants/index';
import { currentLogo } from '#config';
import { Embed, ActionRow, ButtonComponent, ButtonStyle } from 'discord.js';
import type { Message } from 'discord.js';
import { Command } from '@sapphire/framework';
import { buildCustomId } from '#src/constants/components';

export default class GameTransfer extends Command {
  public override name = 'gametransfer';
  public override description =
    'See a step-by-step guide to transfering your game progress into the cloud and onto another device.';
  public override fullCategory = [Categories.game, Subcategories.other];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Game Transfer')
      .setColor(randomColor)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(currentLogo.name)
      .setImage(gameTransferPages[0])
      .setDescription('Step 1:');
    const component = new ActionRow().addComponents(
      new ButtonComponent()
        .setCustomId(buildCustomId({ command: 'gametransfer', action: 'left', id: user.id }))
        .setEmoji({ name: '⬅️' })
        .setStyle(ButtonStyle.Primary),
      new ButtonComponent()
        .setCustomId(
          JSON.stringify({
            command: 'gametransfer',
            action: 'right',
            id: user.id,
          }),
        )
        .setEmoji({ name: '➡️' })
        .setStyle(ButtonStyle.Primary),
    );
    return {
      embeds: [embed],
      files: [currentLogo],
      components: [component],
    };
  }

  public async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
