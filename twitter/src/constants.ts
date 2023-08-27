export const isProduction = process.env.NODE_ENV === 'production';

export const cellToSingularityTweetsChannel = '706102474821468182';

export enum LogLevel {
  /**
   * The lowest log level, used when calling {@link WebhookLogger.trace}.
   */
  Trace = 10,
  /**
   * The debug level, used when calling {@link WebhookLogger.debug}.
   */
  Debug = 20,
  /**
   * The info level, used when calling {@link WebhookLogger.info}.
   */
  Info = 30,
  /**
   * The warning level, used when calling {@link WebhookLogger.warn}.
   */
  Warn = 40,
  /**
   * The error level, used when calling {@link WebhookLogger.error}.
   */
  Error = 50,
  /**
   * The critical level, used when calling {@link WebhookLogger.fatal}.
   */
  Fatal = 60,
  /**
   * An unknown or uncategorized level.
   */
  None = 100,
}
