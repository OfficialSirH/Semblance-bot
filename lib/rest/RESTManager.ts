import { APIRequest } from './APIRequest';
import { routeBuilder } from './APIRouter';
import { RequestHandler } from './RequestHandler';
import { Semblance } from '@semblance/src/structures';
import { Collection } from 'discord.js';
import { Constants } from 'discord.js';
const { Endpoints } = Constants;

export class RESTManager {
    client: Semblance;
    handlers: Collection<string, RequestHandler>;
    globalDelay: Promise<void>;
    globalRemaining: number;
    globalLimit: number;
    globalReset: number;
    tokenPrefix: string;
    versioned: boolean;
    globalTimeout: Promise<void>;

    constructor(client: Semblance) {
        this.client = client;
        this.handlers = new Collection();
        this.tokenPrefix = 'Bot';
        this.versioned = true;
        this.globalTimeout = null;
        if (client.options.restSweepInterval > 0) {
            setInterval(() => {
                this.handlers.sweep(handler => handler._inactive);
            }, client.options.restSweepInterval * 1000);
        }
    }

  get api() {
    return routeBuilder(this);
  }

  getAuth() {
    const token = this.client.token;
    if (token) return `${this.tokenPrefix} ${token}`;
    throw new Error('TOKEN_MISSING');
  }

  get cdn() {
    return Endpoints.CDN(this.client.options.http.cdn);
  }

  request(method: string, url: string, options = {}) {
    const apiRequest = new APIRequest(this, method, url, options);
    let handler = this.handlers.get(apiRequest.route);

    if (!handler) {
      handler = new RequestHandler(this);
      this.handlers.set(apiRequest.route, handler);
    }

    return handler.push(apiRequest);
  }

  get endpoint() {
    return this.client.options.http.api;
  }

  set endpoint(endpoint) {
    this.client.options.http.api = endpoint;
  }
}