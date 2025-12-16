import type { PageServerLoad } from './$types';

// Mock video data for development
const MOCK_VIDEOS = [
	{
		id: 'video-1',
		title: 'Sample Video',
		description: 'A beautiful hike in the mountains',
		duration_seconds: 120,
		r2_key: 'videos/sample.mp4',
		thumbnail_key: 'thumbnails/sample.jpg',
		recorded_at: '2025-12-01T12:00:00Z',
		category: 'public',
	},
	{
		id: 'video-2',
		title: 'Another Video',
		description: 'Fun with friends',
		duration_seconds: 180,
		r2_key: 'videos/another.mp4',
		thumbnail_key: 'thumbnails/another.jpg',
		recorded_at: '2025-12-02T15:30:00Z',
		category: 'public',
	},
];

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	// TODO: Fetch video from D1 via API
	const video = MOCK_VIDEOS.find(v => v.id === id);
	if (!video) {
		throw new Error('Video not found');
	}

	// Construct streaming URL (placeholder)
	// In production, this would be the Worker URL
	const streamUrl = `/api/videos/${video.r2_key}`; // temporary, should be Worker endpoint

	return {
		video: {
			...video,
			streamUrl,
		},
	};
};