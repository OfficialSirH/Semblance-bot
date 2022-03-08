import type { CommandInteraction, Message, User } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { Categories, getAvatar, randomColor } from '#constants/index';
import { type Args, Command, type ApplicationCommandRegistry } from '@sapphire/framework';

export default class Avatar extends Command {
  public override name = 'avatar';
  public override description = 'Get the avatar of a user.';
  public override fullCategory = [Categories.utility];

  public async chatInputRun(interaction: CommandInteraction<'cached'>) {
    const user = interaction.options.getUser('user')
        ? await this.container.client.users.fetch(interaction.options.getUser('user').id)
        : interaction.member.user,
      author = interaction.member.user,
      embed = new MessageEmbed()
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

    const embed = new MessageEmbed()
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
          type: 'USER',
          description: 'The user to get the avatar of.',
          required: false,
        },
      ],
    });
  }
}
