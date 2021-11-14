import { fetch } from '#lib/utils/fetch';
import { Headers } from 'undici';
import { ApiError } from '#structures/ApiError';

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
  private options: APIOptions;
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

  protected async _request(method: string, path: string, body?: Record<string, unknown>): Promise<unknown> {
    const headers = new Headers();
    if (this.options.token) headers.set('Authorization', this.options.token);
    if (method !== 'GET') headers.set('Content-Type', 'application/json');

    let url = `${this.options.baseUrl}${path}`;

    if (body && method === 'GET') url += `?${new URLSearchParams(body as Record<string, string>)}`;

    const response = await fetch(url, {
      method,
      headers,
      body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    let responseBody: unknown;
    if (response.headers.get('Content-Type')?.startsWith('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(this.options.baseUrl, response.status, response.statusText, response);
    }

    return responseBody;
  }
}
