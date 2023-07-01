import { type Dispatcher, Headers, request } from 'undici';
import { ApiError } from './ApiError.js';

interface APIOptions {
  token: string;
  baseUrl: string;
}

/**
 * A base API Client for Posting stats or Fetching data
 * @example
 * ```js
 * import { BaseAPI } from '#structures/BaseAPI';
 *
 * const api = new BaseAPI({ token: 'token', baseUrl: 'https://discord.com/api/v69' });
 * ```
 */
export class BaseAPI {
  protected options: APIOptions;
  /**
   * Create base API instance
   * @param {object} options API Options
   */
  constructor(options: APIOptions) {
    this.options = {
      token: options.token,
      baseUrl: options.baseUrl,
    };
  }

  protected async _request(
    method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT',
    path: string,
    body?: Record<string, unknown>,
  ): Promise<unknown> {
    const headers = new Headers();
    if (this.options.token) headers.set('Authorization', this.options.token);
    if (method !== 'GET') headers.set('Content-Type', 'application/json');

    let url = `${this.options.baseUrl}${path}`;

    if (body && method === 'GET') url += `?${new URLSearchParams(body as Record<string, string>)}`;

    const requestHeaders: Record<string, string> = {};

    for (const [key, value] of headers.entries()) {
      requestHeaders[key] = value;
    }

    const response = await request(url, {
      method,
      headers: requestHeaders,
      body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    let responseBody: unknown;
    if ((response.headers['content-type'] as string)?.startsWith('application/json')) {
      responseBody = await response.body.json();
    } else {
      responseBody = await response.body.text();
    }

    if (!response.statusCode.toString().startsWith('2')) {
      this.apiErrorHandler(response);
    }

    return responseBody;
  }

  private apiErrorHandler(response: Dispatcher.ResponseData) {
    throw new ApiError(this.options.baseUrl, response.statusCode, 'failed in some way', response);
  }
}
