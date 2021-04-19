import { Request, Response } from "express";
import { Semblance } from "../structures";

export const EVENTS: EVENTS;

type ClientEventType = 'interactionCreate'
    | 'message' 
    | 'messageDelete'
    | 'messageDM'
    | 'messageReactionAdd'
    | 'messageReactionRemove'
    | 'messageUpdate'
    | 'ready';

type BLEventType = 'botListSpace'
    | 'botsForDiscord'
    | 'discordBoat'
    | 'discordBotList'
    | 'discordBotsGG'
    | 'topGG';

type TwitterEventType = 'checkTweet';

type ClientEventFormat = (client: Semblance) => void;

interface BLEventFormat {
    run: (client: Semblance) => void;
    voteHandler: (req: Request, res: Response) => void;
}

interface EVENTS {
    CLIENT: Record<ClientEventType, ClientEventFormat>;
    BOT_LISTING: Record<BLEventType, BLEventFormat>;
    TWITTER: Record<TwitterEventType, ClientEventFormat>;
}