import type {
  APIInteractionResponse,
  InteractionResponseType,
  APIInteraction as MainAPIInteraction,
} from 'discord-api-types/v9';
import type { Client, Snowflake } from 'discord.js';
import type { FastifyReply } from 'fastify';

type NonNestedDirectories = 'commands' | 'images';
export type ReadDirString = `./dist/src/${NonNestedDirectories}`;

declare module 'fs' {
  type readdir = (path: ReadDirString) => Promise<string[]>;
}

declare module 'fs/promises' {
  type readdir = (path: ReadDirString) => Promise<string[]>;
}

export interface CustomIdData {
  command: string;
  action: string;
  id: Snowflake;
}

export type ParsedCustomIdData<T extends string = string, NewData extends CustomIdData = CustomIdData> = Omit<
  NewData,
  'command' | 'action'
> & {
  action: T;
};

export type APIInteractionResponseWithData = Exclude<
  APIInteractionResponse,
  { type: InteractionResponseType.Pong | InteractionResponseType.DeferredMessageUpdate }
>;

export type APIInteractionReplyFunction<NeedsClient extends boolean = false> = NeedsClient extends true
  ? (data: APIInteractionResponseWithData) => FastifyReply
  : (data: APIInteractionResponseWithData, client: Client) => FastifyReply;

export type APIInteraction = MainAPIInteraction & {
  /**
   * response with customizable response type
   */
  send: APIInteractionReplyFunction;
  /**
   * response with Channel Message With Source response type
   */
  reply: APIInteractionReplyFunction;
  /**
   * response with Deffered Channel Message With Source response type
   */
  deferReply: APIInteractionReplyFunction;
  /**
   * edit the initial response
   * @param client The client that will be used to edit the message.
   */
  editReply: APIInteractionReplyFunction<true>;
  /**
   * delete the initial response
   * @param client The client that will be used to delete the message.
   */
  deleteReply: APIInteractionReplyFunction<true>;
  /**
   * follow up the initial response
   * @param client The client that will be used to follow up the message.
   */
  followUp: APIInteractionReplyFunction<true>;
  /**
   * edit a follow up response
   * @param client The client that will be used to edit the message.
   * @param messageId The id of the message to edit.
   */
  editFollowUp: (messageId: Snowflake, client: Client) => unknown;
  /**
   * delete a follow up response
   * @param client The client that will be used to delete the message.
   * @param messageId The id of the message to delete.
   */
  deleteFollowUp: (messageId: Snowflake, client: Client) => unknown;
  /**
   * response with modal response type
   */
  modal: APIInteractionReplyFunction;
  /**
   * response with update message response type
   */
  update: APIInteractionReplyFunction;
  /**
   * response with deferred update message response type
   */
  deferUpdate: APIInteractionReplyFunction;
  /**
   * response with autocomplete response type
   */
  respond: APIInteractionReplyFunction;
};
