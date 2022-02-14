import { ApplicationCommandOptionType, type ChatInputCommandInteraction, type Message, type User } from 'discord.js';
import { Embed } from 'discord.js';
import { Categories, getAvatar, randomColor } from '#constants/index';
import { type Args, Command, type ApplicationCommandRegistry } from '@sapphire/framework';

export default class Avatar extends Command {
  public override name = 'avatar';
  public override description = 'Get the avatar of a user.';
  public override fullCategory = [Categories.utility];

  public async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    const user = interaction.options.getUser('user')
        ? await this.container.client.users.fetch(interaction.options.getUser('user').id)
        : interaction.member.user,
      author = interaction.member.user,
      embed = new Embed()
        .setTitle(`${user.username}'s Avatar`)
        .setAuthor({ name: `${author.tag}`, iconURL: author.displayAvatarURL() })
        .setColor(randomColor)
        .setImage(getAvatar(user));
    return interaction.reply({ embeds: [embed] });
  }

  public async messageRun(message: Message, args: Args) {
    const userArg = await args.pickResult('user');
    let user: User;

    if (!userArg.success) user = message.author;
    else user = userArg.value;

    const embed = new Embed()
      .setTitle('Avatar')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setImage(getAvatar(user));
    message.channel.send({ embeds: [embed] });
  }

  public registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'user',
          type: ApplicationCommandOptionType.User,
          description: 'The user to get the avatar of.',
          required: false,
        },
      ],
    });
  }
}
