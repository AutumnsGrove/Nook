export interface Env {
	DB: D1Database;
	VIDEOS_BUCKET: R2Bucket;
	THUMBNAILS_BUCKET: R2Bucket;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		// Placeholder routing
		if (path.startsWith('/api/')) {
			return new Response(JSON.stringify({ message: 'Worker API placeholder' }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response('Nook Worker', { status: 200 });
	},
};