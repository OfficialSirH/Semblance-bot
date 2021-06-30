import { NextFunction, Request, Response } from "express";
import * as rawBody from 'raw-body';
import { parse } from 'querystring';
import { Semblance } from ".";

/**
 * Webhook Class
 * @example
 * const express = require('express')
 * const { Webhook } = require(`./structures`)
 *
 * const app = express()
 * const wh = new Webhook('webhookauth123')
 *
 * app.post('/webhook', wh.middleware(), (req, res) => {
 *   // req.vote is your vote object e.g
 *   console.log(req.vote.user) // => 780995336293711875
 * })
 *
 * app.listen(80)
 *
 * // In this situation, your Webhook dashboard should look like
 * // URL = http://your.server.ip:80/webhook
 * // Authorization: webhookauth123
 */

export class Webhook {
    private auth: string;
    public static client: Semblance;

    /**
     * Create a new webhook client instance
     * @param authorization Webhook authorization to verify requests
     */
    constructor(authorization: string) {
        this.auth = authorization;
    }
    _formatIncoming(body: any) {
        var _a;
        if (((_a = body === null || body === void 0 ? void 0 : body.query) === null || _a === void 0 ? void 0 : _a.length) > 0)
            body.query = parse(body.query.substr(1));
        return body;
    }
    _parseRequest(req: Request, res: Response) {
        return new Promise(resolve => {
            if (this.auth && req.headers.authorization !== this.auth)
                return res.status(403).json({ error: 'Unauthorized' });
            // parse json
            if (req.body)
                return resolve(this._formatIncoming(req.body));
            rawBody(req, {}, (error, body) => {
                if (error)
                    return res.status(422).json({ error: 'Malformed request' });
                try {
                    const parsed = JSON.parse(body.toString('utf8'));
                    resolve(this._formatIncoming(parsed));
                }
                catch (err) {
                    res.status(400).json({ error: 'Invalid body' });
                    resolve(false);
                }
            });
        });
    }
    /**
     * Middleware function to pass to express, sets req.vote to the payload
     * @example
     * app.post('/webhook', wh.middleware(), (req, res) => {
     *   // req.vote is your payload e.g
     *   console.log(req.vote.user) // => 780995336293711875
     * })
     */
    middleware() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const response = await this._parseRequest(req, res);
            if (!response)
                return res.sendStatus(404);
            res.sendStatus(200);
            req = {
                ...req,
                vote: response,
                client: Webhook.client
            } as any;
            next();
        };
    }
}
