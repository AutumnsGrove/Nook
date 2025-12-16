import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// TODO: Fetch known faces from D1
	return json([]);
};

export const POST: RequestHandler = async ({ request }) => {
	// TODO: Add new face
	return json({ message: 'Face endpoint placeholder' });
};