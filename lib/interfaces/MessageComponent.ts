import { Snowflake } from 'discord.js';

export declare class MessageComponent {
    public readonly components: Components;

    constructor(data: ComponentData)
    
    public addButton(component: Component): MessageComponent;

    addButtons(components: Component[]): MessageComponent;

    public static normalizeComponent(component: Component): Component;

    public static get STYLES(): ComponentStyle;
}

export type Components = ComponentRow[];

export interface ComponentRow {
    type: ComponentType;
    components: Component[];
}

export interface Component {
    type?: ComponentType;
    disabled?: boolean;
    style?: ComponentStyle;
    custom_id?: string;
    placeholder?: string;
    min_values?: number;
    max_values?: number;
    options?: DropdownOptions[];
    label?: string;
    url?: string;
    emoji?: ComponentEmoji;
}

export interface DropdownOptions {
    label: string;
    value: string;
}

export enum ComponentType {
    ACTION_ROW = 1,
    BUTTON,
    DROPDOWN
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

export type ComponentData = Component[] | Component;