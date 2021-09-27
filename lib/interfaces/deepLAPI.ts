export interface DeepLParams extends Record<string, unknown> {
    auth_key?: string;
    target_lang?: 'en-US';
    text: string;
}

export interface DeepLResponse {
    detected_source_language: string;
    text: string;
}