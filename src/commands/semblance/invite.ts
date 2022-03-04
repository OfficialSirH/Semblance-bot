import { Embed } from 'discord.js';
import type { Message, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '@sapphire/framework';
import { Categories, randomColor } from '#src/constants';

export default class Invite extends Command {
  public override name = 'invite';
  public override description = 'Gets an invite link for the bot and support server.';
  public override fullCategory = [Categories.semblance];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Bot Invite')
      .setColor(randomColor)
      .setThumbnail(builder.client.user.displayAvatarURL())
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setDescription(
        `Invite me to your server be clicking [here](https://discord.com/oauth2/authorize?client_id=${builder.client.user.id}&permissions=274878295040&scope=bot+applications.commands).` +
          '\n\n[Semblance Support server](https://discord.gg/XFMaTn6taf)',
      )
      .setFooter({ text: 'Spread the word about Semblance!' });
    return { embeds: [embed] };
  }

  public async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.reply(this.sharedRun(interaction));
  }
}
