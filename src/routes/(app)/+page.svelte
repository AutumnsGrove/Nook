<script lang="ts">
	import VideoGrid from '$lib/components/VideoGrid.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { videos } = data;
</script>

<h1>Nook</h1>
<p>Welcome to your cozy video corner.</p>

{#if videos.length > 0}
	<VideoGrid {videos} />
{:else}
	<p>No videos yet. Upload your first video!</p>
{/if}

<style>
	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}
	p {
		color: var(--color-text-secondary);
		margin-bottom: 2rem;
	}
</style>