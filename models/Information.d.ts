import { Snowflake } from 'discord.js';
import { Model, Document } from 'mongoose';

type infoType = 'beta'
    | 'update'
    | 'github'
    | 'codes'
    | 'changelog'
    | 'cacheList'
    | 'beyondcount';

export interface InformationFormat extends Document {
    infoType: infoType;
    info: string;
    count: number;
    updated: boolean;
    expired: string;
    list: Snowflake[];
    footer: string;
}

export const Information: Model<InformationFormat>;