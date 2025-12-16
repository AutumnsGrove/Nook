import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// TODO: Implement Heartwood auth and allowlist gate
	// For now, return placeholder user
	return {
		user: null
	};
};