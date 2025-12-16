import type { LayoutServerLoad } from './$types';
import { getSession, isUserAllowed } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ request }) => {
	const user = getSession(request);

	// If no user, they are not authenticated (will be redirected later)
	if (!user) {
		return { user: null, allowed: false };
	}

	// Check allowlist
	const allowed = await isUserAllowed(user);

	return {
		user,
		allowed,
		// Additional data can be added here
	};
};