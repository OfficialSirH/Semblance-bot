import { isProduction } from '#constants/index';
import { type LogLevel, Logger } from '@sapphire/framework';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/rest/v10';
export class WebhookLogger extends Logger {
  rest: REST;

  constructor(readonly level: LogLevel) {
    super(level);
    this.rest = new REST().setToken(process.env.TOKEN);
  }

  write(level: LogLevel, ...values: unknown[]) {
    if (!this.has(level)) return;
    const method = Logger.levels.get(level);
    const content = [`[${method.toUpperCase()}]`, ...values].join(' ');
    if (typeof method === 'string') console[method](content);

    const environment = isProduction ? 'PROD' : 'DEV';
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
      Routes.webhook(process.env[`${environment}_LOG_ID`], process.env[`${environment}_LOG_TOKEN`]),
      options,
    );
  }
}
