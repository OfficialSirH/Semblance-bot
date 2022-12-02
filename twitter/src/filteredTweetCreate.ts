import { isProduction, cellToSingularityTweetsChannel } from './constants.js';
import type { TweetV2SingleStreamResult } from 'twitter-api-v2';
import type { REST } from '@discordjs/rest';
import { type APIMessage, Routes } from 'discord-api-types/v10';

export const filteredTweetCreate = async (rest: REST, tweet: TweetV2SingleStreamResult) => {
  const content = `Hey! **ComputerLunch** just posted a new Tweet!\nhttps://twitter.com/ComputerLunch/status/${tweet.data.id}?s=21`;

  if (!isProduction) {
    rest.logger.info(content);
    return;
  }

  const msg = (await rest.post(Routes.channelMessages(cellToSingularityTweetsChannel), {
    body: { content },
  })) as APIMessage;
  await rest.post(Routes.channelMessageCrosspost(cellToSingularityTweetsChannel, msg.id));
};
