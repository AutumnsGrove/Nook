import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// TODO: Fetch allowlist from D1
	return json([]);
};

export const POST: RequestHandler = async ({ request }) => {
	// TODO: Add user to allowlist
	return json({ message: 'Allowlist endpoint placeholder' });
};