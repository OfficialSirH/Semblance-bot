import * as https from 'https';
import * as FormData from '@discordjs/form-data';
import AbortController from 'abort-controller';
import fetch from 'node-fetch';
import { Constants } from 'discord.js';
import { Semblance } from '@semblance/src/structures';
import { RequestOptions } from './APIRouter';
import { RESTManager } from './RESTManager';
const { UserAgent } = Constants;

if (https.Agent) var agent = new https.Agent({ keepAlive: true });

export class APIRequest {
    rest: RESTManager;
    client: Semblance;
    method: string;
    path: string;
    options: RequestOptions;
    route: string;
    retries: number;

    constructor(
        rest: RESTManager, 
        method: string, 
        path: string, 
        options: RequestOptions
        ) {
        this.rest = rest;
        this.client = rest.client;
        this.method = method;
        this.route = options.route;
        this.options = options;
        this.retries = 0;

        let queryString = '';
        if (options.query) {
        const query = Object.entries(options.query)
            .filter(([, value]) => ![null, 'null', 'undefined'].includes(value) && typeof value !== 'undefined')
            .flatMap(([key, value]) => (Array.isArray(value) ? value.map(v => [key, v]) : [[key, value]]));
        queryString = new URLSearchParams(query).toString();
        }
        this.path = `${path}${queryString && `?${queryString}`}`;
    }

    make() {
        const API =
        this.options.versioned === false
            ? this.client.options.http.api
            : `${this.client.options.http.api}/v${this.client.options.http.version}`;
        const url = API + this.path;
        let headers: { [key: string]: any } = {};

        if (this.options.auth !== false) headers.Authorization = this.rest.getAuth();
        if (this.options.reason) headers['X-Audit-Log-Reason'] = encodeURIComponent(this.options.reason);
        headers['User-Agent'] = UserAgent;
        if (this.options.headers) headers = Object.assign(headers, this.options.headers);

        let body;
        if (this.options.files && this.options.files.length) {
        body = new FormData();
        for (const file of this.options.files) if (file && file.file) body.append(file.name, file.file, file.name);
        if (typeof this.options.data !== 'undefined') body.append('payload_json', JSON.stringify(this.options.data));
        headers = Object.assign(headers, body.getHeaders());
        // eslint-disable-next-line eqeqeq
        } else if (this.options.data != null) {
        body = JSON.stringify(this.options.data);
        headers['Content-Type'] = 'application/json';
        }

        const controller = new AbortController();
        const timeout = this.client.setTimeout(() => controller.abort(), this.client.options.restRequestTimeout);
        return fetch(url, {
        method: this.method,
        headers,
        agent,
        body,
        signal: controller.signal,
        }).finally(() => this.client.clearTimeout(timeout));
    }
}