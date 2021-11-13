/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetch as undiciFetch } from 'undici';

export const fetch: typeof undiciFetch = async (url, options?) => {
  const res = await undiciFetch(url, {
    keepalive: true,
    ...options,
  });
  // eslint-disable-next-line no-empty
  for await (const chunk of res.body) {
  }
  return res;
};
