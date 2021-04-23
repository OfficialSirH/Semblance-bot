import { Snowflake } from 'discord.js';

export declare class MessageComponent {
    public readonly components: Components;

    constructor(data: ComponentData)
    
    addButton(component: Component): MessageComponent;

    normalizeComponent(component: Component): Component;
}

export type Components = ComponentRow[];

export interface ComponentRow {
    type: ComponentType;
    components: Component[];
}

export interface Component {
    type: ComponentType;
    disabled?: boolean;
    style: ComponentStyle;
    custom_id: string;
    label: string;
    emoji?: ComponentEmoji;
}

export enum ComponentType {
    ACTION_ROW = 1,
    BUTTON
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