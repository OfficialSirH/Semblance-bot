import { Semblance } from "@semblance/src/structures";
import { HTTPError, Snowflake } from "discord.js";
import { Request } from 'express';

/**
 * Creates a new client.
 * @class Client
 */
export declare class Client {
    public _baseURL: string;
    public _options: object;

	/**
	 * @param {object} options An object with client options.
	 * @param {string} options.id The ID of the bot.
	 * @param {string} options.botToken The token provided from the bots's token page.
	 */
	constructor(options: object);

    /**
         * Posts server count to the site.
         * @memberof Client
         * @returns {Promise<undefined|HTTPError>}
         * @param {number | Array<number>} count The server count, or array of server count as shards.
         */
    postServerCount(count: number | Array<number>): Promise<undefined|HTTPError>;
}

export interface vote {
    site: string;
    bot: Snowflake;
    user: {
        id: Snowflake;
        username: string;
        discriminator: string;
        avatar: string;
        short_description: string;
    },
    timestamp: number;
    type?: string;
}

export interface request extends Request {
    vote: vote;
    client: Semblance;
}