import { ContextMenuHandlerOptions } from '@semblance/lib/interfaces/Semblance';
import { fetchDeepL } from '@semblance/src/constants/commands';
import { ContextMenuInteraction, Message } from 'discord.js';

export const run = async (interaction: ContextMenuInteraction, { options }: ContextMenuHandlerOptions) => {
    const message = options.getMessage('message', true) as Message,
    translateData = await fetchDeepL({ text: message.content });

    return interaction.reply({ content: `Language: ${translateData.detected_source_language}\n\n${translateData.text}`, ephemeral: true });
};