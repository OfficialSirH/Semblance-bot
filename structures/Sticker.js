module.exports = class Sticker {
    constructor(sticker) {
        this.tags = sticker.tags
        this.packID = sticker.pack_id
        this.previewAsset = sticker.preview_asset
        this.name = sticker.name
        this.id = sticker.id
        this.formatType = sticker.format_type
        this.description = sticker.description
        this.asset = sticker.asset
        this.url = this.formatType == 3 ? `https://discord.com/stickers/${this.id}/${this.asset}.json` : `https://media.discordapp.net/stickers/${this.id}/${this.asset}.png?size=256`
    }
}