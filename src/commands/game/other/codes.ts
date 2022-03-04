import { ActionRow, ButtonComponent, ButtonStyle, Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor, Subcategories } from '#constants/index';
import { currentLogo } from '#config';
import { Command } from '@sapphire/framework';

export default class Codes extends Command {
  public override name = 'codes';
  public override description = 'get all of the ingame codes';
  public override fullCategory = [Categories.game, Subcategories.other];

  public override async sharedRun(builder: Command['SharedBuilder']) {
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

  public override async messageRun(message: Message) {
    await message.reply(await this.sharedRun(message));
  }
}
