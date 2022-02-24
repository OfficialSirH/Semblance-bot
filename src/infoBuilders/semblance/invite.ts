import { randomColor } from '#src/constants';
import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { Embed } from 'discord.js';

export default class Invite extends InfoBuilder {
  public override name = 'invite';

  public build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Bot Invite')
      .setColor(randomColor)
      .setThumbnail(builder.client.user.displayAvatarURL())
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setDescription(
        `Invite me to your server be clicking [here](https://discord.com/oauth2/authorize?client_id=${builder.client.user.id}&permissions=8&scope=bot+applications.commands).` +
          '\n\n[Semblance Support server](https://discord.gg/XFMaTn6taf)',
      )
      .setFooter({ text: 'Spread the word about Semblance!' });
    return { embeds: [embed] };
  }
}
