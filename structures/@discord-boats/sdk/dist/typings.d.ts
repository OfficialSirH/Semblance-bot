/**
 * Discord ID
 */
export declare type Snowflake = string;

export interface bot {
    id: Snowflake;
    name: string;
}

export interface user {
    id: Snowflake;
    username: string;
    discriminator: number;
}

export interface WebhookPayload {
    /**
     * Bot that was voted for
     */
    bot: bot;
    /**
     * User that voted for the bot
     */
    user: user;
}
