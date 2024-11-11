import { LogLevel, isProduction } from '#lib/utilities/index';
import { Routes } from '@discordjs/core';
import type { REST } from '@discordjs/rest';

type ConsoleFunctions = {
	[K in keyof typeof console]: (typeof console)[K] extends (...args: unknown[]) => void ? K : never;
}[keyof typeof console];

export class WebhookLogger {
	public static levels = new Map<LogLevel, ConsoleFunctions>([
		[LogLevel.Trace, 'trace'],
		[LogLevel.Debug, 'debug'],
		[LogLevel.Info, 'info'],
		[LogLevel.Warn, 'warn'],
		[LogLevel.Error, 'error'],
		[LogLevel.Fatal, 'error'],
		[LogLevel.None, 'log']
	]);

	constructor(
		readonly rest: REST,
		readonly level: LogLevel
	) {}

	debug(...values: unknown[]) {
		this.write(LogLevel.Debug, ...values);
	}

	info(...values: unknown[]) {
		this.write(LogLevel.Info, ...values);
	}

	warn(...values: unknown[]) {
		this.write(LogLevel.Warn, ...values);
	}

	error(...values: unknown[]) {
		this.write(LogLevel.Error, ...values);
	}

	fatal(...values: unknown[]) {
		this.write(LogLevel.Fatal, ...values);
	}

	write(level: LogLevel, ...values: unknown[]) {
		const method = WebhookLogger.levels.get(level);
		const content = [`[${method?.toUpperCase()}]`, ...values].join(' ');
		if (typeof method === 'string') console[method](content);

		const environment = isProduction ? 'PROD' : 'DEV';
		const webhookLogType = level >= LogLevel.Warn ? (`${environment}_ERR_LOG` as const) : (`${environment}_LOG` as const);

		if (content.length === 0) content.concat('Somehow got empty content');
		const options: Parameters<REST['post']>[1] =
			content.length > 1998
				? {
						files: [{ name: 'log.txt', data: Buffer.from(content) }]
					}
				: {
						body: { content: `\`\`\`diff\n${content}\`\`\`` }
					};

		this.rest.post(Routes.webhook(process.env[`${webhookLogType}_ID`] as string, process.env[`${webhookLogType}_TOKEN`]), options);
	}
}
