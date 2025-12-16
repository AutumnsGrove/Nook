<script lang="ts">
	export let videos: any[] = [];
</script>

<div class="video-grid">
	{#each videos as video}
		<div class="video-card">
			<h3>{video.title}</h3>
			<p>{video.duration}</p>
		</div>
	{/each}
</div>

<style>
	.video-grid {
		display: grid;
		gap: 1rem;
	}
</style>