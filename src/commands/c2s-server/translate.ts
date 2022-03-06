import { fetchDeepL } from '#constants/commands';
import { Categories } from '#src/constants';
import { Command } from '@sapphire/framework';
import type { ContextMenuCommandInteraction } from 'discord.js';

export default class Translate extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'translate',
      description: 'Translates a message to English.',
      fullCategory: [Categories.c2sServer],
      preconditions: ['ModOnly'],
    });
  }

  public override async contextMenuRun(interaction: ContextMenuCommandInteraction<'cached'>) {
    const message = interaction.options.getMessage('message');
    if (!message) return interaction.reply('Invalid message.');

    await interaction.deferReply({ ephemeral: true });
    const translateData = await fetchDeepL({ text: message.content });

    return interaction.followUp({
      content: `Language: ${translateData.detected_source_language}\n\n${translateData.text}`,
    });
  }
}
