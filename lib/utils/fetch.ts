import { fetch as undiciFetch } from 'undici';
import type { ControlledAsyncIterable } from 'undici';

// always use keep-alive
export const fetch: typeof undiciFetch = async (url, options?) => {
  return undiciFetch(url, {
    keepalive: true,
    ...options,
  });
};

export const consumeBody = async (body: ControlledAsyncIterable): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
  for await (const _chunk of body) {
  }
};
