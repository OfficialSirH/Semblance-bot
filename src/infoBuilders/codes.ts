import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed, ActionRow, ButtonComponent, ButtonStyle } from 'discord.js';
import { currentLogo } from '#config';
import type { Piece } from '@sapphire/framework';
import type { InfoBuilderOption } from 'Semblance';

export default class Codes extends InfoBuilder {
  public override name = 'codes';

  public constructor(context: Piece.Context) {
    super(context);
  }

  public override async build(builder: InfoBuilderOption) {
    const user = 'user' in builder ? builder.user : builder.author;
    const codeHandler = await this.container.client.db.information.findUnique({ where: { type: 'codes' } });
    const embed = new Embed()
      .setTitle('Darwinium Codes')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setDescription(codeHandler.value)
      .setFooter({ text: codeHandler.footer });
    const component = new ActionRow().addComponents(
      new ButtonComponent()
        .setCustomId(
          JSON.stringify({
            command: 'codes',
            action: 'expired',
            id: user.id,
          }),
        )
        .setLabel('View Expired Codes')
        .setStyle(ButtonStyle.Primary),
    );
    return {
      embeds: [embed],
      files: [currentLogo],
      components: [component],
    };
  }
}
