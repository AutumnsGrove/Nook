export interface Env {
	DB: D1Database;
	VIDEOS_BUCKET: R2Bucket;
	THUMBNAILS_BUCKET: R2Bucket;
}

// Simple authentication placeholder
function isAuthenticated(request: Request): boolean {
	// TODO: Implement Heartwood token validation
	// For now, allow all requests in development
	return true;
}

async function handleVideoStream(request: Request, env: Env, key: string): Promise<Response> {
	// Check authentication
	if (!isAuthenticated(request)) {
		return new Response('Unauthorized', { status: 401 });
	}

	const object = await env.VIDEOS_BUCKET.get(key);
	if (object === null) {
		return new Response('Video not found', { status: 404 });
	}

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set('etag', object.httpEtag);

	// Support range requests for streaming
	if (request.headers.has('range')) {
		const range = request.headers.get('range')!;
		const [start, end] = range.replace('bytes=', '').split('-').map(Number);
		const size = object.size;

		const actualStart = start || 0;
		const actualEnd = end && end < size ? end : size - 1;

		if (actualStart >= size || actualEnd >= size) {
			return new Response('Range Not Satisfiable', { status: 416 });
		}

		const chunk = await object.range(actualStart, actualEnd);
		headers.set('content-range', `bytes ${actualStart}-${actualEnd}/${size}`);
		headers.set('content-length', `${actualEnd - actualStart + 1}`);
		headers.set('accept-ranges', 'bytes');
		return new Response(chunk, {
			status: 206,
			headers,
		});
	}

	// Full response
	headers.set('content-length', object.size.toString());
	headers.set('accept-ranges', 'bytes');
	return new Response(object.body, { headers });
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		// Video streaming endpoint
		if (path.startsWith('/videos/')) {
			const key = path.slice('/videos/'.length);
			return handleVideoStream(request, env, key);
		}

		// API endpoints
		if (path.startsWith('/api/')) {
			// TODO: Implement API routes
			return new Response(JSON.stringify({ message: 'Worker API placeholder' }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Default response
		return new Response('Nook Worker', { status: 200 });
	},
};