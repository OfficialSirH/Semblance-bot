import type { ChatInputCommandInteraction } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories } from '#constants/index';
import { ApplicationCommandRegistry, Command } from '@sapphire/framework';

export default class Game extends Command {
  public override name = 'game';
  public override description = 'An idle-game within Semblance';
  public override fullCategory = [Categories.fun];

  public override async messageRun(message: Message) {
    await message.reply(await message.client.stores.get('infoBuilders').get('game').build(message));
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.reply(await interaction.client.stores.get('infoBuilders').get('game').build(interaction));
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
    });
  }
}
