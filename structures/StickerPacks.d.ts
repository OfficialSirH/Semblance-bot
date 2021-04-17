import { Sticker } from './Sticker';

export declare class StickerPacks {
    /**
     * 
     * @param storeData Store raw data for stickers
     * @param sticker_packs an element of storeData
     */
    constructor(storeData: object);
    private sticker_packs: stickerpacks;

    get stickerPacks(): stickerpacks;

    static get storeDirectory(): string;
}

interface stickerpacks {
    [packName: string]: {
        id: string;
        stickers: Sticker[];
        skuID: string;
        coverStickerID: string;
        storeListing: string;
    }
}