export declare class Webhook {
    private auth;
    /**
     * Create a new webhook client instance
     * @param authorization Webhook authorization to verify requests
     */
    constructor(authorization?: string);
    private _formatIncoming;
    private _parseRequest;
    /**
     * Middleware function to pass to express, checks validity of request
     */
    middleware(): (req: any, res: any, next: any) => Promise<void>;
}