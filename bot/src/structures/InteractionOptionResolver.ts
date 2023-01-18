import {
  ApplicationCommandOptionType,
  type APIUser,
  type APIRole,
  type APIInteractionDataResolved,
  type APIInteractionDataResolvedChannel,
  type APIInteractionDataResolvedGuildMember,
  type APIAttachment,
  type Snowflake,
  type APIMessage,
  type APIChatInputApplicationCommandInteraction,
  type APIApplicationCommandAutocompleteInteraction,
} from '@discordjs/core';
import { InteractionOption } from './InteractionOption';

export class InteractionOptionResolver {
  public readonly _subcommandgroup: string | undefined;
  public readonly _subcommand: string | undefined;
  public readonly options: InteractionOption[] | undefined;
  public readonly resolved: (APIInteractionDataResolved & { messages: Record<Snowflake, APIMessage> }) | undefined;

  public constructor(
    interaction: APIChatInputApplicationCommandInteraction | APIApplicationCommandAutocompleteInteraction,
  ) {
    this.resolved =
      (interaction.data.resolved as APIInteractionDataResolved & { messages: Record<Snowflake, APIMessage> }) ??
      undefined;

    if (interaction.data.options?.[0].type === ApplicationCommandOptionType.SubcommandGroup) {
      this._subcommandgroup = interaction.data.options[0].name;
      this._subcommand = interaction.data.options[0].options?.[0].name;
      this.options =
        interaction.data.options[0].options?.[0].options?.map(option => new InteractionOption(option)) ?? [];
    } else if (interaction.data.options?.[0].type === ApplicationCommandOptionType.Subcommand) {
      this._subcommand = interaction.data.options[0].name;
      this.options = interaction.data.options[0].options?.map(option => new InteractionOption(option)) ?? [];
    } else {
      this.options = interaction.data.options?.map(option => new InteractionOption(option)) ?? [];
    }
  }

  /**
   * get the first option with the given name
   * @param name the name of the option to get
   * @example
   * ```typescript
   * const option = interaction.options.get('optionName');
   * ```
   * @returns the first option with the given name
   * @throws if no option with the given name is found
   * @throws if the option is not a string
   */
  public get(name: string, throwIfNotHere = false): InteractionOption | undefined {
    const option = this.options?.find(option => option.name === name);
    if (!option && throwIfNotHere) throw new Error(`Option "${name}" not found`);
    return option;
  }

  /**
   * get the subcommand group
   * @example
   * ```typescript
   * const subcommandgroup = interaction.options.getSubcommandGroup();
   * ```
   * @returns the subcommand group
   * @throws if the interaction does not have a subcommand group
   * @throws if the interaction has a subcommand group but no subcommand
   */
  public getSubcommandGroup(throwIfNotHere = false): string | undefined {
    if (!this._subcommandgroup) {
      if (throwIfNotHere) throw new Error('No subcommand group');
      return undefined;
    }
    if (!this._subcommand) {
      if (throwIfNotHere) throw new Error('No subcommand');
      return undefined;
    }
    return this._subcommandgroup;
  }

  /**
   * get the subcommand
   * @example
   * ```typescript
   * const subcommand = interaction.options.getSubcommand();
   * ```
   * @returns the subcommand
   * @throws if the interaction does not have a subcommand
   */
  public getSubcommand(throwIfNotHere = false): string | undefined {
    if (!this._subcommand) {
      if (throwIfNotHere) throw new Error('No subcommand');
      return undefined;
    }
    return this._subcommand;
  }

  /**
   * get the value of the option as a string
   * @example
   * ```typescript
   * const option = interaction.options.get('optionName');
   * const value = option.getString('optionName');
   * ```
   * @returns the value of the option as a string
   * @throws if no option with the given name is found
   * @throws if the option is not a string
   */
  public getString(name: string, throwIfNotHere: true): string;
  public getString(name: string): string | undefined;

  public getString(name: string, throwIfNotHere = false): string | undefined {
    const option = this.get(name);
    if (!option) {
      if (throwIfNotHere) throw new Error(`Option "${name}" not found`);
      return undefined;
    }
    if (option.type !== ApplicationCommandOptionType.String) throw new Error(`Option "${name}" is not a string`);
    return option.value as string;
  }

  /**
   * get the value of the option as a integer
   * @example
   * ```typescript
   * const option = interaction.options.get('optionName');
   * const value = option.getInteger('optionName');
   * ```
   * @returns the value of the option as a integer
   * @throws if no option with the given name is found
   * @throws if the option is not a integer
   */
  public getInteger(name: string, throwIfNotHere: true): number;
  public getInteger(name: string): number | undefined;

  public getInteger(name: string, throwIfNotHere = false): number | undefined {
    const option = this.get(name);
    if (!option) {
      if (throwIfNotHere) throw new Error(`Option "${name}" not found`);
      return undefined;
    }
    if (option.type !== ApplicationCommandOptionType.Integer) throw new Error(`Option "${name}" is not a number`);
    return option.value as number;
  }

  /**
   * get the value of the option as a number
   * @example
   * ```typescript
   * const option = interaction.options.get('optionName');
   * const value = option.getNumber('optionName');
   * ```
   * @returns the value of the option as a number
   * @throws if no option with the given name is found
   * @throws if the option is not a number
   */
  public getNumber(name: string, throwIfNotHere: true): number;
  public getNumber(name: string): number | undefined;

  public getNumber(name: string, throwIfNotHere = false): number | undefined {
    const option = this.get(name);
    if (!option) {
      if (throwIfNotHere) throw new Error(`Option "${name}" not found`);
      return undefined;
    }
    if (option.type !== ApplicationCommandOptionType.Number) throw new Error(`Option "${name}" is not a number`);
    return option.value as number;
  }

  /**
   * get the value of the option as a boolean
   * @example
   * ```typescript
   * const option = interaction.options.get('optionName');
   * const value = option.getBoolean('optionName');
   * ```
   * @returns the value of the option as a boolean
   * @throws if no option with the given name is found
   * @throws if the option is not a boolean
   */
  public getBoolean(name: string, throwIfNotHere: true): boolean;
  public getBoolean(name: string): boolean | undefined;

  public getBoolean(name: string, throwIfNotHere = false): boolean | undefined {
    const option = this.get(name);
    if (!option) {
      if (throwIfNotHere) throw new Error(`Option "${name}" not found`);
      return undefined;
    }
    if (option.type !== ApplicationCommandOptionType.Boolean) throw new Error(`Option "${name}" is not a boolean`);
    return option.value as boolean;
  }

  /**
   * get the value of the option as a user
   * @example
   * ```typescript
   * const option = interaction.options.get('optionName');
   * const value = option.getUser('optionName');
   * ```
   * @returns the value of the option as a user
   * @throws if no option with the given name is found
   * @throws if the option is not a user
   */
  public getUser(name: string, throwIfNotHere: true): APIUser;
  public getUser(name: string): APIUser | undefined;

  public getUser(name: string, throwIfNotHere = false): APIUser | undefined {
    const option = this.get(name);
    if (!option) {
      if (throwIfNotHere) throw new Error(`Option "${name}" not found`);
      return undefined;
    }
    if (option.type !== ApplicationCommandOptionType.User) throw new Error(`Option "${name}" is not a user`);
    return this.resolved?.users?.[option.value as string];
  }

  /**
   * get the value of the option as a channel
   * @example
   * ```typescript
   * const option = interaction.options.get('optionName');
   * const value = option.getChannel('optionName');
   * ```
   * @returns the value of the option as a channel
   * @throws if no option with the given name is found
   * @throws if the option is not a channel
   */
  public getChannel(name: string, throwIfNotHere: true): APIInteractionDataResolvedChannel;
  public getChannel(name: string): APIInteractionDataResolvedChannel | undefined;

  public getChannel(name: string, throwIfNotHere = false): APIInteractionDataResolvedChannel | undefined {
    const option = this.get(name);
    if (!option) {
      if (throwIfNotHere) throw new Error(`Option "${name}" not found`);
      return undefined;
    }
    if (option.type !== ApplicationCommandOptionType.Channel) throw new Error(`Option "${name}" is not a channel`);
    return this.resolved?.channels?.[option.value as string];
  }

  /**
   * get the value of the option as a role
   * @example
   * ```typescript
   * const option = interaction.options.get('optionName');
   * const value = option.getRole('optionName');
   * ```
   * @returns the value of the option as a role
   * @throws if no option with the given name is found
   * @throws if the option is not a role
   */
  public getRole(name: string, throwIfNotHere: true): APIRole;
  public getRole(name: string): APIRole | undefined;

  public getRole(name: string, throwIfNotHere = false): APIRole | undefined {
    const option = this.get(name);
    if (!option) {
      if (throwIfNotHere) throw new Error(`Option "${name}" not found`);
      return undefined;
    }
    if (option.type !== ApplicationCommandOptionType.Role) throw new Error(`Option "${name}" is not a role`);
    return this.resolved?.roles?.[option.value as string];
  }

  /**
   * get the value of the option as a mentionable
   * @example
   * ```typescript
   * const option = interaction.options.get('optionName');
   * const value = option.getMentionable('optionName');
   * ```
   * @returns the value of the option as a mentionable
   * @throws if no option with the given name is found
   * @throws if the option is not a mentionable
   */
  public getMentionable(name: string, throwIfNotHere: true): APIUser | APIRole | APIInteractionDataResolvedGuildMember;
  public getMentionable(name: string): APIUser | APIRole | APIInteractionDataResolvedGuildMember | undefined;

  public getMentionable(
    name: string,
    throwIfNotHere = false,
  ): APIUser | APIRole | APIInteractionDataResolvedGuildMember | undefined {
    const option = this.get(name);
    if (!option) {
      if (throwIfNotHere) throw new Error(`Option "${name}" not found`);
      return undefined;
    }
    if (option.type !== ApplicationCommandOptionType.Mentionable)
      throw new Error(`Option "${name}" is not a mentionable`);
    return (
      this.resolved?.members?.[option.value as string] ??
      this.resolved?.users?.[option.value as string] ??
      this.resolved?.roles?.[option.value as string]
    );
  }

  /**
   * get the value of the option as an attachment
   * @example
   * ```typescript
   * const option = interaction.options.get('optionName');
   * const value = option.getAttachment('optionName');
   * ```
   * @returns the value of the option as an attachment
   * @throws if no option with the given name is found
   * @throws if the option is not an attachment
   */
  public getAttachment(name: string, throwIfNotHere: boolean): APIAttachment;
  public getAttachment(name: string): APIAttachment | undefined;

  public getAttachment(name: string, throwIfNotHere = false): APIAttachment | undefined {
    const option = this.get(name);
    if (!option) {
      if (throwIfNotHere) throw new Error(`Option "${name}" not found`);
      return undefined;
    }
    if (option.type !== ApplicationCommandOptionType.Attachment)
      throw new Error(`Option "${name}" is not an attachment`);
    return this.resolved?.attachments?.[option.value as string];
  }

  /**
   * get resolved message
   * @example
   * ```typescript
   * const option = interaction.options.get('optionName');
   * const value = option.getMessage('optionName');
   * ```
   * @returns the value of the option as a message
   * @throws if there is no resolved message
   */
  public getMessage(throwIfNotHere: boolean): APIMessage;
  public getMessage(): APIMessage | undefined;

  public getMessage(throwIfNotHere = false): APIMessage | undefined {
    const resolved = this.resolved?.messages?.[Object.keys(this.resolved.messages)[0] as string];
    if (!resolved) {
      if (throwIfNotHere) throw new Error(`Option "${name}" not found`);
      return undefined;
    }
    return resolved;
  }

  // get focused
  /**
   * get the focused option
   * @example
   * ```typescript
   * const option = interaction.options.get('optionName');
   * const focused = option.getFocused();
   * ```
   * @returns the focused option
   * @throws if there is no focused option
   */
  public getFocused(throwIfNotHere: boolean): string | number;
  public getFocused(): string | number | undefined;

  public getFocused(throwIfNotHere = false): string | number | undefined {
    const focused = this.options?.find(o => o.focused);
    if (!focused) {
      if (throwIfNotHere) throw new Error(`Option "${name}" not found`);
      return undefined;
    }
    return focused.value as string | number;
  }
}
