const tips = {
  401: 'You need a token for this endpoint',
  403: "You don't have access to this endpoint",
};
/**
 * API Error
 */
export class ApiError extends Error {
  code: number;
  text: string;
  response?: unknown;

  constructor(origin: string, code: number, text: string, response?: unknown) {
    super(`${code} ${text}${tips[code] ? ` (${tips[code]})` : ''}`);
    this.name = `${origin} API Error`;
    this.response = response;
  }
}
