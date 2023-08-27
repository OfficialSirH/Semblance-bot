import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();

import { REST } from '@discordjs/rest';
import { isProduction, LogLevel } from './constants.js';
import { WebhookLogger } from './WebhookLogger.js';

declare module '@discordjs/rest' {
  interface REST {
    logger: WebhookLogger;
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
rest.logger = new WebhookLogger(rest, isProduction ? LogLevel.Info : LogLevel.Trace);

import { checkTweet } from './checkTweet.js';
import { TwitterInitialization } from './TwitterInitialization.js';

if (isProduction) {
  const twitterAvailabilityTimer = setTimeout(() => {
    if (!TwitterInitialization.online)
      TwitterInitialization.fallbackHandlerInterval = setInterval(() => checkTweet(rest), 2_000);
  }, 300_000);
  await TwitterInitialization.initialize(rest);
  clearTimeout(twitterAvailabilityTimer);
} else {
  setInterval(() => checkTweet(rest), 2_000);
}
