export interface APIParams extends Record<string, unknown> {
    'has_breeds': boolean;
    'mime_types': string;
    'size': sizeType;
    'sub_id': string;
    'limit': number;
};
export type sizeType = 'small' | 'medium' | 'large';