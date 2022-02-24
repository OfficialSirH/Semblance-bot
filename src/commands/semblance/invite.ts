import type { ChatInputCommandInteraction } from 'discord.js';
import type { Message } from 'discord.js';
import { Command } from '@sapphire/framework';

export default class Invite extends Command {
  public override name = 'invite';
  public override description = 'Gets an invite link for the bot and support server.';

  public async messageRun(message: Message) {
    await message.reply(await message.client.stores.get('infoBuilders').get(this.name).build(message));
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.reply(await interaction.client.stores.get('infoBuilders').get(this.name).build(interaction));
  }
}
