import { isProduction, LogLevel } from '../constants.js';
import type { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/rest/v10';
type LogMethods = 'trace' | 'debug' | 'info' | 'warn' | 'error';

export class WebhookLogger {
  static levels = new Map<LogLevel, LogMethods>([
    [LogLevel.Trace, 'trace'],
    [LogLevel.Debug, 'debug'],
    [LogLevel.Info, 'info'],
    [LogLevel.Warn, 'warn'],
    [LogLevel.Error, 'error'],
    [LogLevel.Fatal, 'error'],
  ]);

  constructor(readonly rest: REST, readonly level: LogLevel) {}

  trace(...values: unknown[]) {
    this.write(LogLevel.Trace, values);
  }

  debug(...values: unknown[]) {
    this.write(LogLevel.Debug, values);
  }

  info(...values: unknown[]) {
    this.write(LogLevel.Info, values);
  }

  warn(...values: unknown[]) {
    this.write(LogLevel.Warn, values);
  }

  error(...values: unknown[]) {
    this.write(LogLevel.Error, values);
  }

  fatal(...values: unknown[]) {
    this.write(LogLevel.Fatal, values);
  }

  write(level: LogLevel, ...values: unknown[]) {
    if (!WebhookLogger.levels.has(level)) return;
    const method = WebhookLogger.levels.get(level);
    const content = [`[${method?.toUpperCase()}]`, ...values].join(' ');
    if (typeof method === 'string') console[method](content);

    const environment = isProduction ? ('PROD' as const) : ('DEV' as const);
    const webhookLogType =
      level >= LogLevel.Warn ? (`${environment}_ERR_LOG` as const) : (`${environment}_LOG` as const);

    if (content.length == 0) content.concat('Somehow got empty content');
    const options: Parameters<REST['post']>[1] =
      content.length > 1998
        ? {
            files: [{ name: 'log.txt', data: Buffer.from(content) }],
          }
        : {
            body: { content: `\`\`\`diff\n${content}\`\`\`` },
          };

    this.rest.post(
      Routes.webhook(process.env[`${webhookLogType}_ID`], process.env[`${webhookLogType}_TOKEN`]),
      options,
    );
  }
}
