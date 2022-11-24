import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();

import { isProduction } from '#constants/index';
import { WebhookLogger } from '#structures/WebhookLogger';

rest.setToken(isProduction ? process.env.TOKEN : process.env.DEV_TOKEN);

import { checkTweet } from './twitter/checkTweet.js';
import { TwitterInitialization } from '#structures/TwitterInitialization';
// Check for Tweet from ComputerLunch
const twitterAvailabilityTimer = setTimeout(() => {
  if (!TwitterInitialization.online)
    TwitterInitialization.fallbackHandlerInterval = setInterval(() => checkTweet(client), 2_000);
}, 300_000);
await TwitterInitialization.initialize(client);
clearTimeout(twitterAvailabilityTimer);
