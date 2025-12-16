<script lang="ts">
	import { page } from '$app/stores';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { video } = data;
</script>

<h1>{video.title}</h1>
<p>Recorded on {new Date(video.recorded_at).toLocaleDateString()}</p>
<p>{video.description}</p>

<VideoPlayer src={video.streamUrl} title={video.title} />

<div class="metadata">
	<p>Duration: {Math.floor(video.duration_seconds / 60)}:{String(video.duration_seconds % 60).padStart(2, '0')}</p>
	<p>Category: {video.category}</p>
</div>

<style>
	h1 {
		margin-bottom: 0.5rem;
	}
	.metadata {
		margin-top: 2rem;
		color: var(--color-text-secondary);
	}
</style>