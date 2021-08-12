import { Snowflake } from 'discord.js';
import { Model, Document, Schema, model } from 'mongoose';

type infoType = 'beta'
    | 'joinbeta'
    | 'update'
    | 'github'
    | 'codes'
    | 'changelog'
    | 'cacheList'
    | 'beyondcount'
    | 'boostercodes';

export interface InformationFormat extends Document {
    infoType: infoType;
    info: string;
    count: number;
    updated: boolean;
    expired: string;
    list: any[];
    footer: string;
}

const InformationSchema = new Schema({
    infoType: String,
    info: {
        type: String,
        default: "Nope"
    },
    count: {
        type: Number,
        default: 1
    },
    updated: {
        type: Boolean,
        default: false
    },
    expired: String,
    list: {
        type: Array,
        default: []
    },
    footer: {
        type: String,
        default: "Much emptiness"
    }
});

export const Information = model<InformationFormat>("Information", InformationSchema, "Information");