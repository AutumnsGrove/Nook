import type { PageServerLoad } from './$types';

// Mock videos for development
const MOCK_VIDEOS = [
	{
		id: 'video-1',
		title: 'Mountain Hike',
		description: 'A beautiful hike in the mountains',
		duration: '2:00',
		duration_seconds: 120,
		recorded_at: '2025-12-01T12:00:00Z',
		category: 'public',
		thumbnailUrl: 'https://picsum.photos/seed/video1/400/225',
	},
	{
		id: 'video-2',
		title: 'Beach Sunset',
		description: 'Sunset at the beach with friends',
		duration: '3:15',
		duration_seconds: 195,
		recorded_at: '2025-12-02T15:30:00Z',
		category: 'public',
		thumbnailUrl: 'https://picsum.photos/seed/video2/400/225',
	},
	{
		id: 'video-3',
		title: 'City Walk',
		description: 'Walking through the city streets',
		duration: '1:45',
		duration_seconds: 105,
		recorded_at: '2025-12-03T10:20:00Z',
		category: 'public',
		thumbnailUrl: 'https://picsum.photos/seed/video3/400/225',
	},
];

export const load: PageServerLoad = async () => {
	// TODO: Fetch videos from D1 via API
	return {
		videos: MOCK_VIDEOS,
	};
};