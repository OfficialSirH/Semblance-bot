import _ from 'mongoose';

type Info = 'beta' | 'joinbeta' | 'update' | 'codes' | 'changelog' | 'boostercodes' | 'Mixed';

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
  Mixed: typeof _.Schema.Types.Mixed;
}

export interface InformationFormat<T extends Info = Info> {
  infoType: T;
  info: string;
  count: number;
  updated: boolean;
  expired: string;
  list: List[T];
  footer: string;
}

const InformationSchema = new _.Schema<InformationFormat<'Mixed'>>({
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
  list: _.Schema.Types.Mixed,
  footer: {
    type: String,
    default: 'Much emptiness',
  },
});

export const Information = _.model<InformationFormat<Info>>('Information', InformationSchema, 'Information');
