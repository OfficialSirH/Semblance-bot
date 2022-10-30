import type { InteractionHandler } from '@sapphire/framework';
import {
  type APIButtonComponentWithCustomId,
  type APISelectMenuComponent,
  type MessageActionRowComponentBuilder,
  type ActionRowBuilder,
  type MessageComponentInteraction,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import type { CustomIdData } from '#lib/interfaces/Semblance';

export const filterAction = (
  components: ActionRowBuilder<MessageActionRowComponentBuilder>[],
  action: string,
): ActionRowBuilder<MessageActionRowComponentBuilder>[] =>
  components.map(row =>
    row.setComponents(
      row.components.filter(
        c => JSON.parse((c.data as APIButtonComponentWithCustomId | APISelectMenuComponent).custom_id).action != action,
      ),
    ),
  );

export const disableComponentsByLabel = (
  components: ActionRowBuilder<MessageActionRowComponentBuilder>[],
  labels: string[],
  { enableInstead = false, oppositeOfLabel = false }: { enableInstead?: boolean; oppositeOfLabel?: boolean },
): ActionRowBuilder<MessageActionRowComponentBuilder>[] =>
  components.map(row =>
    row.setComponents(
      row.components.map(c => {
        if (!('label' in c.data)) return c;
        if (oppositeOfLabel) {
          if (!labels.includes(c.data.label || '')) return c.setDisabled(!enableInstead);
          return c;
        }
        if (labels.includes(c.data.label || '')) return c.setDisabled(!enableInstead);
        return c;
      }),
    ),
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
  if (extraProps)
    for (const prop of Object.keys(extraProps)) {
      if (typeof data[prop as keyof CustomIdData] != extraProps[prop as keyof typeof extraProps]) return handler.none();
    }

  if (data.command != handler.name) return handler.none();
  if (!allowOthers && data.id != interaction.user.id) {
    await interaction.reply({
      content: "this button originates from a message that wasn't triggered by you.",
      ephemeral: true,
    });
    return handler.none();
  }

  const finalizedData = {
    action: data.action,
    id: data.id,
  };
  if (extraProps)
    for (const prop of Object.keys(extraProps)) {
      finalizedData[prop as keyof typeof finalizedData] = data[prop as keyof CustomIdData];
    }
  return handler.some(finalizedData);
};

export const backButton = (command: string, userId: string, whereToGo: string) =>
  new ButtonBuilder()
    .setCustomId(buildCustomId({ command, id: userId, action: whereToGo }))
    .setLabel('Back')
    .setEmoji('⬅️')
    .setStyle(ButtonStyle.Secondary);

export const closeButton = (command: string, userId: string) =>
  new ButtonBuilder()
    .setCustomId(buildCustomId({ command, id: userId, action: 'close' }))
    .setLabel('Close')
    .setEmoji('🚫')
    .setStyle(ButtonStyle.Secondary);

export const defaultEmojiToUsableEmoji = (emoji: string) => ({ name: emoji });

export const buildCustomId = <T extends CustomIdData | (CustomIdData & Record<string, unknown>) = CustomIdData>(
  customIdOptions: T,
) => JSON.stringify(customIdOptions);
