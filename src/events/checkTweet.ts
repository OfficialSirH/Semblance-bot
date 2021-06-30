import * as Twitter from 'twitter';
import fetch from 'node-fetch';
import config from '@semblance/config';
import { Semblance } from '../structures';
import { TextChannel } from 'discord.js';
const { c2sGuildID, lunchGuildID } = config,
twClient = new Twitter(JSON.parse(process.env.twitter));
let current_id = null, screen_name = "ComputerLunch";

export const checkTweet = (client: Semblance) => twClient.get('statuses/user_timeline', {
    screen_name,
    exclude_replies: true,
    count: 1
  }, async (error, tweets, response) => {
      if (error) {
          return console.log(error);
      }
    let tweet = tweets[0];
    try {
    if (tweet.id_str !== current_id && current_id) {
        fetch(process.env.C2SWebhook, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: `Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}`
            })
        });
        let guild = client.guilds.cache.get(c2sGuildID), channel = guild.channels.cache.find(c => c.name == "cells-tweets") as TextChannel;
        channel.send(`Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}`);
  
        guild = client.guilds.cache.get(lunchGuildID), channel = guild.channels.cache.find(c => c.name == 'tweets') as TextChannel;
        channel.send(`Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}`);
    }
    } catch (error) {}
    current_id = tweet.id_str;
  });