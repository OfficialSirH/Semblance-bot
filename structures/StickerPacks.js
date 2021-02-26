const Sticker = require('./Sticker');

class StickerPacks {
    constructor(storeData) {
        this.sticker_packs = storeData['sticker_packs'].reduce((acc, cur, ind, arr) => {
            cur.stickers = cur.stickers.reduce((acc, cur, ind) => {
                cur = new Sticker(cur);
                    return [...acc, cur];
                }, []);
                acc[cur.name] = {
                    id: cur.id,
                    stickers: cur.stickers,
                    skuID: cur.sku_id,
                    coverStickerID: cur.cover_sticker_id,
                    storeListing: cur.store_listing
                };
                return acc;
            }, {});
    }

    get stickerPacks() {
        return this.sticker_packs;
    }
}

StickerPacks.storeDirectory = `https://discord.com/api/v8/sticker-packs/directory-v2/758482250722574376?with_store_listings=true`;

module.exports = StickerPacks;