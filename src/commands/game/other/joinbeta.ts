import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor, Subcategories } from '#constants/index';
import { currentLogo } from '#config';
import { Command } from '@sapphire/framework';

export default class JoinBeta extends Command {
  public override name = 'joinbeta';
  public override description = 'Info on how to become a beta tester';
  public override fullCategory = [Categories.game, Subcategories.other];

  public override async sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const infoHandler = await builder.client.db.information.findUnique({ where: { type: 'joinbeta' } });
    const embed = new MessageEmbed()
      .setTitle('Steps to join beta')
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setFooter({ text: `Called by ${user.tag}` })
      .setDescription(infoHandler.value);
    return { embeds: [embed], files: [currentLogo] };
  }

  public override async messageRun(message: Message) {
    await message.reply(await this.sharedRun(message));
  }
}
