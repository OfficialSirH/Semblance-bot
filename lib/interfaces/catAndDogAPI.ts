export interface AnimalAPIParams extends Record<string, unknown> {
    'has_breeds': boolean;
    'mime_types': string;
    'size': sizeType;
    'sub_id': string;
    'limit': number;
};
export type sizeType = 'small' | 'medium' | 'large';

export type AnimalAPIResponse = {
    url: string;
    breeds: {
        name: string;
        temperament: string;
    }[];
}[];