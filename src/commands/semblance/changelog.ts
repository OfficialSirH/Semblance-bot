import { type Message, MessageEmbed } from 'discord.js';
import { Category, randomColor } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Changelog extends Command {
  public override name = 'changelog';
  public override description = 'Provides the latest changes to Semblance.';
  public override fullCategory = [Category.semblance];

  public override async sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const changelogHandler = await builder.client.db.information.findUnique({ where: { type: 'changelog' } });
    const embed = new MessageEmbed()
      .setTitle('Changelog')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setDescription(changelogHandler.value);
    return { embeds: [embed] };
  }

  public override async messageRun(message: Message) {
    await message.reply(await this.sharedRun(message));
  }
}
