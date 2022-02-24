import { type ApplicationCommandRegistry, Command, Args } from '@sapphire/framework';
import { messageLinkJump } from '#constants/commands';
import { ApplicationCommandOptionType, ChatInputCommandInteraction, Message } from 'discord.js';

export default class Jump extends Command {
  public override name = 'jump';
  public override description = 'This command can create a direct jump/preview of a message link';

  public async messageRun(message: Message, args: Args) {
    const link = await args.pickResult('url');

    if (link.success)
      return message.channel.send(
        await messageLinkJump(link.value.href, message.author, message.guild, message.client),
      );
    else return message.channel.send("The argument you provided isn't a valid link.");
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    const link = interaction.options.getString('url', true);

    return interaction.reply(await messageLinkJump(link, interaction.user, interaction.guild, interaction.client));
  }

  public registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'url',
          type: ApplicationCommandOptionType.String,
          required: true,
          description: 'The message to jump to',
        },
      ],
    });
  }
}
