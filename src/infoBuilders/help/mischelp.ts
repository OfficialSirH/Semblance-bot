import { prefix, randomColor } from '#src/constants';
import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { Embed } from 'discord.js';

export default class Mischelp extends InfoBuilder {
  public override name = 'mischelp';

  public override async build(builder: InfoBuilder['BuildOption']) {
    const client = builder.client;
    const user = 'user' in builder ? builder.user : builder.author;

    const serverCommands = client.stores
      .get('commands')
      .filter(c => c.category === 'server')
      .map(c => `**${prefix}${c.name}**`);
    const funCommands = client.stores
      .get('commands')
      .filter(c => c.category === 'fun')
      .map(c => `**${prefix}${c.name}**`);
    const utilityCommands = client.stores
      .get('commands')
      .filter(c => c.category === 'utility')
      .map(c => `**${prefix}${c.name}**`);
    const semblanceCommands = client.stores
      .get('commands')
      .filter(c => c.category === 'semblance')
      .map(c => `**${prefix}${c.name}**`);

    const embed = new Embed()
      .setTitle('Miscellaneous Commands')
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(randomColor)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .addFields(
        {
          name: '**-> Server Commands**',
          value: serverCommands.join(', '),
          inline: true,
        },
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
}
