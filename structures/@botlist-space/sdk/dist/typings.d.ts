/**
 * Discord ID
 */
export declare type Snowflake = string;
export interface WebhookPayload {
    /**
     * website that the request came from
     */
    site: string;
    /**
     * ID of the bot that the user voted for
     */
    bot: Snowflake;
    /**
     * The user who voted: ID, discriminator, avatar, description
     */
    user: {
        id: Snowflake;
        username: string;
        discriminator: string;
        avatar: string;
        short_description?: string;
    };
    /**
     * The timestamp of when the vote took place
     */
    timestamp: number;
}
