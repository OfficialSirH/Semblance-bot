/**
 * botlist.space Webhook
 * @example
 * const express = require('express')
 * const { Webhook } = require(`./structures/@botlist-space/sdk`)
 *
 * const app = express()
 * const wh = new Webhook('webhookauth123')
 *
 * app.post('/blswebhook', wh.middleware(), (req, res) => {
 *   // req.vote is your vote object e.g
 *   console.log(req.vote.user) // => 321714991050784770
 * })
 *
 * app.listen(80)
 *
 * // In this situation, your botlist.space Webhook dashboard should look like
 * // URL = http://your.server.ip:80/blswebhook
 * // Authorization: webhookauth123
 */
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
     * Middleware function to pass to express, sets req.vote to the payload
     * @example
     * app.post('/blswebhook', wh.middleware(), (req, res) => {
     *   // req.vote is your payload e.g
     *   console.log(req.vote.user) // => 395526710101278721
     * })
     */
    middleware(): (req: any, res: any, next: any) => Promise<void>;
}
