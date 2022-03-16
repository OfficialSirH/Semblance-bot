import type { InteractionHandler } from '@sapphire/framework';
import { type MessageActionRow, type MessageComponentInteraction, MessageButton } from 'discord.js';
import type { CustomIdData } from 'Semblance';

export const filterAction = (components: MessageActionRow[], action: string) =>
  components.map(
    c =>
      ({
        ...c,
        components: c.components.filter(c => JSON.parse(c.customId).action != action),
      } as MessageActionRow),
  );

export const disableComponentsByLabel = (
  components: MessageActionRow[],
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
      } as MessageActionRow),
  );

/**
 * @typedef {Object} ComponentInteractionDefaultParserOptions
 * @property {boolean} [allowOthers=false] Whether or not the interaction handler should allow other users to interact with its components.
 * @property {ComponentInteractionDefaultParserOptions} [extraProps={}] An object containing extra properties that are parsed from the custom_id.
 */
type ComponentInteractionDefaultParserOptions<T extends CustomIdData> = {
  allowOthers?: boolean;
  extraProps?: Record<keyof Omit<T, keyof CustomIdData>, 'number' | 'string'>;
};

/**
 *  The most commonly used parser for the interaction handler. A parser that can be set to only allow the command caller to interact with its components.
 * @param {InteractionHandler} handler The interaction handler that the custom_id is being parsed for.
 * @param {MessageComponentInteraction} interaction The interaction that is being parsed.
 * @param {...ComponentInteractionDefaultParserOptions} options The options for the parser.
 */
export const componentInteractionDefaultParser = async <T extends CustomIdData = CustomIdData>(
  handler: InteractionHandler,
  interaction: MessageComponentInteraction,
  {
    allowOthers = false,
    extraProps = {} as ComponentInteractionDefaultParserOptions<T>['extraProps'],
  }: ComponentInteractionDefaultParserOptions<T> = {
    allowOthers: false,
    extraProps: {} as ComponentInteractionDefaultParserOptions<T>['extraProps'],
  },
) => {
  const data: T = JSON.parse(interaction.customId);
  if (typeof data.action != 'string' || typeof data.command != 'string' || typeof data.id != 'string')
    return handler.none();
  for (const prop of Object.keys(extraProps)) {
    if (typeof data[prop] != extraProps[prop]) return handler.none();
  }

  if (data.command != handler.name) return handler.none();
  if (!allowOthers && data.id != interaction.user.id) {
    await interaction.reply({ content: 'You did not call this command', ephemeral: true });
    return handler.none();
  }

  const finalizedData = {
    action: data.action,
    id: data.id,
  };
  for (const prop of Object.keys(extraProps)) {
    finalizedData[prop] = data[prop];
  }
  return handler.some(finalizedData);
};

export const backButton = (command: string, userId: string, whereToGo: string) =>
  new MessageButton()
    .setCustomId(buildCustomId({ command, id: userId, action: whereToGo }))
    .setLabel('Back')
    .setEmoji('⬅️')
    .setStyle('SECONDARY');

export const closeButton = (command: string, userId: string) =>
  new MessageButton()
    .setCustomId(buildCustomId({ command, id: userId, action: 'close' }))
    .setLabel('Close')
    .setEmoji('🚫')
    .setStyle('SECONDARY');

export const defaultEmojiToUsableEmoji = (emoji: string) => ({ name: emoji });

export const buildCustomId = <T extends CustomIdData | (CustomIdData & Record<string, unknown>) = CustomIdData>(
  customIdOptions: T,
) => JSON.stringify(customIdOptions);
