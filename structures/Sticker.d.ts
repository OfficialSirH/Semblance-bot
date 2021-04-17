export declare class Sticker {
    /**
     * 
     * @param sticker raw sticker data from discord
     */
    constructor(sticker: sticker);
    private tags: string[];
    private packID: string;
    private previewAsset: string;
    private name: string;
    private id: string;
    private formatType: number;
    private description: string;
    private asset: string;
    private url: string;
}

interface sticker {
    tags: string[];
    pack_id: string;
    preview_asset: string;
    name: string;
    id: string;
    format_type: number;
    description: string;
    asset: string;
}