const tips = {
  401: 'You need a token for this endpoint',
  403: "You don't have access to this endpoint",
};
/**
 * API Error
 */
export class ApiError extends Error {
  constructor(origin: string, public code: number, public text: string, public response?: unknown) {
    super(`${code} ${text}${tips[code as keyof typeof tips] ? ` (${tips[code as keyof typeof tips]})` : ''}`);
    this.name = `${origin} API Error`;
    this.response = response;
  }
}
