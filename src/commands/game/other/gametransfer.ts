import { attachments, Category, gameTransferPages, randomColor, Subcategory } from '#constants/index';
import { type Message, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import { Command } from '@sapphire/framework';
import { buildCustomId } from '#constants/components';

export default class GameTransfer extends Command {
  public override name = 'gametransfer';
  public override description =
    'See a step-by-step guide to transfering your game progress into the cloud and onto another device.';
  public override fullCategory = [Category.game, Subcategory.other];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new MessageEmbed()
      .setTitle('Game Transfer')
      .setColor(randomColor)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(attachments.currentLogo.name)
      .setImage(gameTransferPages[0])
      .setDescription('Step 1:');
    const component = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(buildCustomId({ command: 'gametransfer', action: 'left', id: user.id }))
        .setEmoji('⬅️')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(
          buildCustomId({
            command: 'gametransfer',
            action: 'right',
            id: user.id,
          }),
        )
        .setEmoji('➡️')
        .setStyle('PRIMARY'),
    );
    return {
      embeds: [embed],
      files: [attachments.currentLogo],
      components: [component],
    };
  }

  public async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
