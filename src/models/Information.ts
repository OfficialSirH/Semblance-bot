import _ from 'mongoose';

type Info =
  | 'beta'
  | 'joinbeta'
  | 'update'
  | 'github'
  | 'codes'
  | 'changelog'
  | 'cacheList'
  | 'beyondcount'
  | 'boostercodes';

interface List {
  boostercodes: string[];
  codes: string[];
  changelog: string;
  cacheList: string[];
  beyondcount: number;
  github: string;
  update: string;
  joinbeta: string;
  beta: string;
}

export interface InformationFormat<T extends Info> {
  infoType: T;
  info: string;
  count: number;
  updated: boolean;
  expired: string;
  list: List[T];
  footer: string;
}

// TODO: Implement better typings for InformationFormat

// export interface InformationFormat {
//     infoType: infoType;
//     info: string;
//     count: number;
//     updated: boolean;
//     expired: string;
//     list: any;
//     footer: string;
// }

const InformationSchema = new _.Schema<InformationFormat<Info>>({
  infoType: String,
  info: {
    type: String,
    default: 'Nope',
  },
  count: {
    type: Number,
    default: 1,
  },
  updated: {
    type: Boolean,
    default: false,
  },
  expired: String,
  list: {
    type: _.Schema.Types.Mixed as any,
    default: [],
  },
  footer: {
    type: String,
    default: 'Much emptiness',
  },
});

export const Information = _.model<InformationFormat<Info>>('Information', InformationSchema, 'Information');
