"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webhook = void 0;
const raw_body_1 = __importDefault(require("raw-body"));
const querystring_1 = __importDefault(require("querystring"));
/**
 * discordbotlist.com Webhook
 * @example
 * const express = require('express')
 * const { Webhook } = require(`./structures/@bots-for-discord/sdk`)
 *
 * const app = express()
 * const wh = new Webhook('webhookauth123')
 *
 * app.post('/disordblwebhook', wh.middleware(), (req, res) => {
 *   // req.vote is your vote object e.g
 *   console.log(req.vote.user) // => 321714991050784770
 * })
 *
 * app.listen(80)
 *
 * // In this situation, your discordbotlist Webhook dashboard should look like
 * // URL = http://your.server.ip:80/discordblwebhook
 * // Authorization: webhookauth123
 */
class Webhook {
    /**
     * Create a new webhook client instance
     * @param authorization Webhook authorization to verify requests
     */
    constructor(authorization) {
        this.auth = authorization;
    }
    _formatIncoming(body) {
        var _a;
        if (((_a = body === null || body === void 0 ? void 0 : body.query) === null || _a === void 0 ? void 0 : _a.length) > 0)
            body.query = querystring_1.default.parse(body.query.substr(1));
        return body;
    }
    _parseRequest(req, res) {
        return new Promise(resolve => {
            if (this.auth && req.headers.authorization !== this.auth)
                return res.status(403).json({ error: 'Unauthorized' });
            // parse json
            if (req.body)
                return resolve(this._formatIncoming(req.body));
            raw_body_1.default(req, {}, (error, body) => {
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
     * app.post('/discordblwebhook', wh.middleware(), (req, res) => {
     *   // req.vote is your payload e.g
     *   console.log(req.vote.user) // => 395526710101278721
     * })
     */
    middleware() {
        return async (req, res, next) => {
            const response = await this._parseRequest(req, res);
            if (!response)
                return;
            res.sendStatus(200);
            req.vote = response;
            next();
        };
    }
}
exports.Webhook = Webhook;
