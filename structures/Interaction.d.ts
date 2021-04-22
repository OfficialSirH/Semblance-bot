import { Snowflake, Guild, TextChannel, GuildMember, MessageEmbed, User } from 'discord.js';
import { Semblance } from './Semblance';

export declare class Interaction {
    public readonly client: Semblance;
    public readonly id: Snowflake;
    public readonly token: string;
    public readonly applicationId: Snowflake;
    public readonly type: InteractionType;
    public readonly data?: ApplicationCommandInteractionData;
    public readonly guild: Guild;
    public readonly channel: TextChannel;
    public readonly messageId?: Snowflake;
    public readonly member: GuildMember;   
    public readonly version: number;
    public readonly customId?: string;

    constructor(interaction: RawInteraction)

    public send(content: string, { embeds, ephemeral, type }: SendOptions): MessageInteraction;

    public toJSON(): InteractionJSON;
}

export interface SendOptions {
    embeds: MessageEmbed[] | MessageEmbed,
    ephemeral: boolean,
    type: InteractionSendType
}

export enum InteractionSendType {
    Pong = 1,
    ChannelMessageWithSource = 4,
    DeferredChannelMessageWithSource
}

export interface RawInteraction {
    client: Semblance;
    id: Snowflake;
    application_id: Snowflake;
    type: InteractionType;
    data?: ApplicationCommandInteractionData;
    guild_id: Snowflake;
    channel_id: Snowflake;
    message_id?: Snowflake;
    member?: object;
    user?: object;
    token?: string;
    version: number;
}

export type InteractionType = 1 | 2;

export interface ApplicationCommandInteractionData {
    id: Snowflake;
    name: string;
    component_type?: ComponentType;
    custom_id?: string;
    resolved?: ApplicationCommandInteractionDataResolved;
    options?: ApplicationCommandInteractionDataOption[];
}

export enum ComponentType {
    ACTION_ROW = 1,
    BUTTON
} 

export interface ApplicationCommandInteractionDataResolved {
    users?: Snowflake[];
    members?: Snowflake[];
    roles?: Snowflake[];
    channels?: Snowflake[];
}

export interface ApplicationCommandInteractionDataOption {
    name: string;
    type: ApplicationCommandOptionType;
    value?: OptionType;
    options?: ApplicationCommandInteractionDataOption[];
}

declare enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP,
    STRING,
    INTEGER,
    BOOLEAN,
    USER,
    CHANNEL,
    ROLE
}

type OptionType = object | string | number | boolean;

export interface InteractionApplicationCommandCallbackData {
    tts?: boolean;
    content?: string;
    components?: Components;
    embeds?: MessageEmbed[];
    allowed_mentions?: AllowedMentions;
    flags?: Flags;
}

export interface Components {
    type: number;
    components: Component[];
}

export interface Component {
    type: ComponentType;
    disabled?: boolean;
    style: ComponentStyle;
    custom_id: string;
    name?: string;
    label?: string;
    emoji?: ComponentEmoji;
}

export enum ComponentStyle {
    PRIMARY = 1,
    SECONDARY,
    SUCCESS,
    DESTRUCTIVE,
    LINK
}

export interface ComponentEmoji {
    id?: Snowflake;
    name?: string;
    animated?: boolean;
}

export interface AllowedMentions {
    parse: AllowedMentionsType[];
    roles: Snowflake[];
    users: Snowflake[];
    replied_user: boolean;
}

type AllowedMentionsType = 'roles' | 'users' | 'everyone';

export enum Flags {
    ephemeral = 64
}

export interface MessageInteraction {
    id: Snowflake;
    type: InteractionType;
    name: string;
    user: User;
}

export interface InteractionJSON {
    client: string;
    id: Snowflake;
    token: string;
    applicationId: Snowflake;
    type: number;
    data: ApplicationCommandInteractionData;
    guild: string;
    channel: string;
    messageId: Snowflake;
    member: object;
    version: number;
    customId: string;
}