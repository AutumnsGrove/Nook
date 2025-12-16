// Shared TypeScript types for Nook

export interface Video {
	id: string;
	filename: string;
	r2_key: string;
	thumbnail_key?: string;
	title?: string;
	description?: string;
	recorded_at?: string;
	uploaded_at: string;
	duration_seconds: number;
	file_size_bytes: number;
	category: 'public' | 'private' | 'review';
	ai_confidence?: number;
	ai_reasoning?: string;
	has_face_blur: boolean;
	detected_faces_count: number;
	known_faces_count: number;
	processing_status: string;
	published: boolean;
}

export interface KnownFace {
	id: string;
	name: string;
	embedding: number[];
	consent_level: 'owner' | 'blanket' | 'per_video' | 'always_blur';
	reference_image_key?: string;
	created_at: string;
}

export interface AllowlistUser {
	user_id: string;
	email?: string;
	name?: string;
	added_at: string;
	notes?: string;
}