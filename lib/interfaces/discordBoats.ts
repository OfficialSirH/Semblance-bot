import { Semblance } from "@semblance/src/structures";
import { Snowflake } from "discord.js";
import { Request } from 'express';
import { RemoveVoteKey } from "./topGG";

export interface bot {
    id: Snowflake;
    name: string;
}

export interface user {
    id: Snowflake;
    username: string;
    discriminator: number;
}

export interface vote {
    /**
     * Bot that was voted for
     */
    bot: bot;
    /**
     * User that voted for the bot
     */
    user: user;
}

export interface request extends RemoveVoteKey<Request> {
    vote: vote;
    client: Semblance;
}