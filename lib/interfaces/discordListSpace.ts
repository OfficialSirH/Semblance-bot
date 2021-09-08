import type { HTTPError, Snowflake } from "discord.js";
import type { FastifyRequest } from "fastify";

/**
 * Creates a new client.
 * @class Client
 */
export declare class Client {
    public _baseURL: string;
    public _options: object;

	/**
	 * @param {object} options An object with client options.
	 * @param {string} options.id The Id of the bot.
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

export interface DLSVote {
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

export type DLSRequest = FastifyRequest<{ Body: DLSVote }>;