import type { ChatInputCommandInteraction } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';

export default class Credits extends Command {
  public override name = 'credits';
  public override description = 'Lists everyone that has helped with the project of Semblance, including myself(SirH).';
  public override fullCategory = [Categories.semblance];

  public override async messageRun(message: Message) {
    await message.reply(await message.client.stores.get('infoBuilders').get('credits').build(message));
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.reply(await interaction.client.stores.get('infoBuilders').get('credits').build(interaction));
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
    });
  }
}
