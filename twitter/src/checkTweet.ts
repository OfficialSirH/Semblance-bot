import { isProduction, cellToSingularityTweetsChannel } from './constants';
import { TwitterInitialization } from './TwitterInitialization';
import { type ApiResponseError, TwitterApi } from 'twitter-api-v2';
import type { REST } from '@discordjs/rest';
import { type APIMessage, Routes } from 'discord-api-types/v10';
let current_id: string | null = null;
let initialRequestDone = false;
const userId = '618235960'; // ComputerLunch's id

/**
 * fallback for when the stream is not working
 * @param rest rest client
 * @returns void
 */
export const checkTweet = async (rest: REST) => {
  if (TwitterInitialization.online) {
    clearInterval(TwitterInitialization.fallbackHandlerInterval as NodeJS.Timer);
    TwitterInitialization.fallbackHandlerInterval = null;
    return;
  }

  console.info('Checking for new tweets');

  const twClient = new TwitterApi(JSON.parse(process.env.TWITTER).bearer_token);
  const options: Parameters<typeof twClient.v2.readOnly.userTimeline>[1] = { exclude: 'replies' };
  if (current_id) options['since_id'] = current_id;
  const tweets = await twClient.v2.readOnly.userTimeline(userId, options).catch((e: ApiResponseError) => e.data.detail);

  if (typeof tweets === 'string') {
    console.error(tweets);
    return;
  }

  if (!tweets) {
    console.error('No tweets found');
    return;
  }

  const new_id = tweets.data.data?.at(0)?.id;

  if (new_id !== current_id && new_id) {
    current_id = new_id as string;
    if (!isProduction) {
      rest.logger.info('new tweet id: ' + new_id);
      return;
    }

    if (!initialRequestDone) {
      initialRequestDone = true;
      return;
    }

    const msg = (await rest.post(Routes.channelMessages(cellToSingularityTweetsChannel), {
      body: {
        content: `Hey! **ComputerLunch** just posted a new Tweet!\nhttps://twitter.com/ComputerLunch/status/${current_id}?s=21`,
      },
    })) as APIMessage;
    await rest.post(Routes.channelMessageCrosspost(cellToSingularityTweetsChannel, msg.id));
  }
};
