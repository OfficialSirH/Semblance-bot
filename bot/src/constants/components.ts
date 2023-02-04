import type { CustomIdData, ParsedCustomIdData, ResultValue } from '#lib/interfaces/Semblance';
import { type ActionRowBuilder, type MessageActionRowComponentBuilder, ButtonBuilder } from '@discordjs/builders';
import {
  type APIButtonComponentWithCustomId,
  type APISelectMenuComponent,
  ButtonStyle,
  type APIMessageComponentInteraction,
} from '@discordjs/core';

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
export type ComponentInteractionDefaultParserOptions<T extends CustomIdData = CustomIdData> = {
  allowOthers?: boolean;
  extraProps?: Record<keyof Omit<T, keyof CustomIdData>, 'number' | 'string'>;
};

/**
 *  The most commonly used parser for the interaction handler. A parser that can be set to only allow the command caller to interact with its components.
 * @param {APIMessageComponentGuildInteraction} interaction The interaction that is being parsed.
 * @param {...ComponentInteractionDefaultParserOptions} options The options for the parser.
 */
export const componentInteractionDefaultParser = <T extends CustomIdData = CustomIdData>(
  interaction: APIMessageComponentInteraction,
  {
    allowOthers = false,
    extraProps = {} as ComponentInteractionDefaultParserOptions<T>['extraProps'],
  }: ComponentInteractionDefaultParserOptions<T> = {
    allowOthers: false,
    extraProps: {} as ComponentInteractionDefaultParserOptions<T>['extraProps'],
  },
): ResultValue<boolean, ParsedCustomIdData> => {
  const data: T = JSON.parse(interaction.data.custom_id);
  if (typeof data.action != 'string' || typeof data.command != 'string' || typeof data.id != 'string')
    return { ok: false, message: 'invalid custom_id' };
  if (extraProps)
    for (const prop of Object.keys(extraProps)) {
      if (typeof data[prop as keyof CustomIdData] != extraProps[prop as keyof typeof extraProps])
        return { ok: false, message: 'invalid custom_id' };
    }

  if (!allowOthers && data.id != interaction.member?.user.id)
    return {
      ok: false,
      message: "this button originates from a message that wasn't triggered by you.",
    };

  const finalizedData = {
    action: data.action,
    id: data.id,
  };
  if (extraProps)
    for (const prop of Object.keys(extraProps)) {
      finalizedData[prop as keyof typeof finalizedData] = data[prop as keyof CustomIdData];
    }
  return { ok: true, value: finalizedData };
};

export const backButton = (command: string, userId: string, whereToGo: string) =>
  new ButtonBuilder()
    .setCustomId(buildCustomId({ command, id: userId, action: whereToGo }))
    .setLabel('Back')
    .setEmoji({ name: '⬅️' })
    .setStyle(ButtonStyle.Secondary);

export const closeButton = (command: string, userId: string) =>
  new ButtonBuilder()
    .setCustomId(buildCustomId({ command, id: userId, action: 'close' }))
    .setLabel('Close')
    .setEmoji({ name: '🚫' })
    .setStyle(ButtonStyle.Secondary);

export const buildCustomId = <T extends CustomIdData | (CustomIdData & Record<string, unknown>) = CustomIdData>(
  customIdOptions: T,
) => JSON.stringify(customIdOptions);
