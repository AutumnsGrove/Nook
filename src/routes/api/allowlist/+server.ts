import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock allowlist for development
const MOCK_ALLOWLIST = [
	{ user_id: 'user-123', email: 'autumn@example.com', name: 'Autumn', added_at: new Date().toISOString() },
	{ user_id: 'user-456', email: 'friend@example.com', name: 'Friend', added_at: new Date().toISOString() },
];

export const GET: RequestHandler = async () => {
	// TODO: Fetch allowlist from D1
	return json(MOCK_ALLOWLIST);
};

export const POST: RequestHandler = async ({ request }) => {
	// TODO: Add user to allowlist
	const data = await request.json();
	console.log('Would add to allowlist:', data);
	return json({ message: 'Allowlist endpoint placeholder', data });
};