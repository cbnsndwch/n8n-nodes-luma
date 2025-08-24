import type { IDataObject } from 'n8n-workflow';

export interface ImageUploadData extends IDataObject {
    image_type?: 'event_cover' | 'calendar_avatar' | 'user_avatar';
    max_size_bytes?: number;
    allowed_formats?: string[];
    expiration_minutes?: number;
}
