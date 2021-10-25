import type { ContextMenuHandlerOptions } from '#lib/interfaces/Semblance';
import { fetchDeepL } from '#src/constants/commands';
import type { ContextMenuInteraction } from 'discord.js';

export const run = async (interaction: ContextMenuInteraction, { options }: ContextMenuHandlerOptions) => {
  const message = options.getMessage('message', true),
    translateData = await fetchDeepL({ text: message.content });

  return interaction.reply({
    content: `Language: ${translateData.detected_source_language}\n\n${translateData.text}`,
    ephemeral: true,
  });
};
