import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// TODO: Fetch videos from D1
	return json([]);
};

export const POST: RequestHandler = async ({ request }) => {
	// TODO: Handle video upload
	return json({ message: 'Upload endpoint placeholder' });
};