import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor, gameTransferPages } from '#constants/index';
import { Embed, ActionRow, ButtonComponent, ButtonStyle } from 'discord.js';
import { currentLogo } from '#config';
import { buildCustomId } from '#src/constants/components';

export default class Gametransfer extends InfoBuilder {
  public override name = 'gametransfer';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
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
}
