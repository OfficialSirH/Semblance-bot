import { Store } from '@sapphire/framework';
import { InfoBuilder } from '../pieces/InfoBuilder';

export class InfoBuilderStore extends Store<InfoBuilder> {
  public constructor() {
    super(InfoBuilder, { name: 'infoBuilders' });
  }
}

declare module '@sapphire/pieces' {
  export interface StoreRegistryEntries {
    infoBuilders: InfoBuilderStore;
  }
}
