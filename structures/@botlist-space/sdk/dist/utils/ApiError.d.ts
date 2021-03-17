/**
 * API Error
 */
export default class DiscordBotListAPIError extends Error {
    /**
     * Possible response from Request
     */
    response?: any;
    name: string;
    constructor(code: number, text: string, response?: any);
}
