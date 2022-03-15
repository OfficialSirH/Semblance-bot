import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, prefix, randomColor } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class MiscHelp extends Command {
  public override name = 'mischelp';
  public override description = 'List all miscelaneous commands';
  public override fullCategory = [Categories.help];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const client = builder.client;
    const user = 'user' in builder ? builder.user : builder.author;

    const funCommands = client.stores
      .get('commands')
      .filter(c => c.category === Categories.fun)
      .map(c => `**${prefix}${c.name}**`);
    const utilityCommands = client.stores
      .get('commands')
      .filter(c => c.category === Categories.utility)
      .map(c => `**${prefix}${c.name}**`);
    const semblanceCommands = client.stores
      .get('commands')
      .filter(c => c.category === Categories.semblance)
      .map(c => `**${prefix}${c.name}**`);

    const embed = new MessageEmbed()
      .setTitle('Miscellaneous Commands')
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(randomColor)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .addFields(
        {
          name: '**-> Fun Commands**',
          value: funCommands.join(', '),
          inline: true,
        },
        {
          name: '**-> Utility Commands**',
          value: utilityCommands.join(', '),
          inline: true,
        },
        {
          name: '**=> Semblance-related Commands**',
          value: semblanceCommands.join(', '),
          inline: true,
        },
      );
    return { embeds: [embed] };
  }

  public async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
