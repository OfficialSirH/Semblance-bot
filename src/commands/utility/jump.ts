import { type ApplicationCommandRegistry, Command, Args } from '@sapphire/framework';
import { messageLinkJump } from '#constants/commands';
import type { CommandInteraction, Message } from 'discord.js';

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

  public async chatInputRun(interaction: CommandInteraction<'cached'>) {
    const link = interaction.options.getString('url', true);
    console.log(link);
    return interaction.reply(await messageLinkJump(link, interaction.user, interaction.guild, interaction.client));
  }

  public registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'url',
          type: 'STRING',
          required: true,
          description: 'The message to jump to',
        },
      ],
    });
  }
}
