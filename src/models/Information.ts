import { Schema, model } from 'mongoose';

type infoType = 'beta'
    | 'joinbeta'
    | 'update'
    | 'github'
    | 'codes'
    | 'changelog'
    | 'cacheList'
    | 'beyondcount'
    | 'boostercodes';

// interface List {
//     'boostercodes': string[];
//     'codes': string[];
//     'changelog': string;
//     'cacheList': string[];
//     'beyondcount': number;
//     'github': string;
//     'update': string;
//     'joinbeta': string;
//     'beta': string;
// }

// export interface InformationFormat<T extends infoType> {
//     infoType: T;
//     info: string;
//     count: number;
//     updated: boolean;
//     expired: string;
//     list: List[T];
//     footer: string;
// }

// TODO: Implement better typings for InformationFormat

export interface InformationFormat {
    infoType: infoType;
    info: string;
    count: number;
    updated: boolean;
    expired: string;
    list: any;
    footer: string;
}

const InformationSchema = new Schema<InformationFormat>({
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