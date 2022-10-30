import { type Message, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { Category, randomColor } from '#constants/index';

export default class Invite extends Command {
  public override name = 'invite';
  public override description = 'Gets an invite link for the bot and support server.';
  public override fullCategory = [Category.semblance];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new EmbedBuilder()
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

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.reply(this.sharedRun(interaction));
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
    });
  }
}
