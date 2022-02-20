import type { InteractionHandler } from '@sapphire/framework';
import { type ActionRow, type MessageComponentInteraction, ButtonComponent, ButtonStyle } from 'discord.js';
import type { CustomIdData } from 'Semblance';

export const filterAction = (components: ActionRow[], action: string) =>
  components.map(
    c =>
      ({
        ...c,
        components: c.components.filter(c => JSON.parse(c.custom_id).action != action),
      } as ActionRow),
  );

export const disableComponentsByLabel = (
  components: ActionRow[],
  labels: string[],
  { enableInstead = false, oppositeOfLabel = false }: { enableInstead?: boolean; oppositeOfLabel?: boolean },
) =>
  components.map(
    c =>
      ({
        ...c,
        components: c.components.map(c => {
          if (!('label' in c)) return c;
          if (oppositeOfLabel) {
            if (!labels.includes(c.label)) return c.setDisabled(!enableInstead);
            return c;
          }
          if (labels.includes(c.label)) return c.setDisabled(!enableInstead);
        }),
      } as ActionRow),
  );

/**
 *  The most commonly used parser for the interaction handler. A parser that only allows the command caller to interact with its components.
 * @param {InteractionHandler} handler The interaction handler that the custom_id is being parsed for.
 * @param {MessageComponentInteraction} interaction The interaction that is being parsed.
 */
export const componentInteractionSimpleParser = async (
  handler: InteractionHandler,
  interaction: MessageComponentInteraction,
) => {
  const data: CustomIdData = JSON.parse(interaction.customId);
  if (data.command != handler.name) return handler.none();
  if (data.id != interaction.user.id) {
    await interaction.reply({ content: 'You did not call this command', ephemeral: true });
    return handler.none();
  }
  return handler.some(data.action);
};

export const backButton = (command: string, userId: string, whereToGo: string) =>
  new ButtonComponent()
    .setCustomId(buildCustomId({ command, id: userId, action: whereToGo }))
    .setLabel('Back')
    .setEmoji(defaultEmojiToUsableEmoji('⬅️'))
    .setStyle(ButtonStyle.Secondary);

export const closeButton = (command: string, userId: string) =>
  new ButtonComponent()
    .setCustomId(buildCustomId({ command, id: userId, action: 'close' }))
    .setLabel('Close')
    .setEmoji(defaultEmojiToUsableEmoji('🚫'))
    .setStyle(ButtonStyle.Secondary);

export const defaultEmojiToUsableEmoji = (emoji: string) => ({ name: emoji });

export const buildCustomId = (customIdOptions: CustomIdData) => JSON.stringify(customIdOptions);
