// Heartwood authentication utilities
// TODO: Integrate with Grove SSO
// For now, mock authentication for development

import { dev } from '$app/environment';

export interface User {
	id: string;
	email: string;
	name: string;
}

// Mock user for development
const MOCK_USER: User = {
	id: 'user-123',
	email: 'autumn@example.com',
	name: 'Autumn'
};

/**
 * Get session from request (cookie, header, etc.)
 * In production, this would validate Heartwood tokens.
 */
export function getSession(request: Request): User | null {
	// For development, return mock user if dev mode
	if (dev) {
		return MOCK_USER;
	}
	// Otherwise, no session (requires real auth)
	return null;
}

/**
 * Require authentication; throws if not authenticated.
 */
export function requireAuth(request: Request): User {
	const user = getSession(request);
	if (!user) {
		throw new Error('Authentication required');
	}
	return user;
}

/**
 * Check if user is allowed (allowlist) - to be implemented later.
 */
export async function isUserAllowed(user: User): Promise<boolean> {
	// TODO: query allowlist from D1
	// For now, allow any authenticated user in dev mode
	if (dev) {
		return true;
	}
	// In production, deny by default until implemented
	return false;
}