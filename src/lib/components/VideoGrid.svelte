<script lang="ts">
	export let videos: any[] = [];
</script>

<div class="video-grid">
	{#each videos as video (video.id)}
		<a href={`/watch/${video.id}`} class="video-card">
			{#if video.thumbnailUrl}
				<img src={video.thumbnailUrl} alt={video.title} loading="lazy" />
			{:else}
				<div class="thumbnail-placeholder">
					<span>🎬</span>
				</div>
			{/if}
			<div class="video-info">
				<h3>{video.title}</h3>
				<p class="duration">{video.duration}</p>
				<p class="date">{video.recorded_at ? new Date(video.recorded_at).toLocaleDateString() : ''}</p>
			</div>
		</a>
	{/each}
</div>

<style>
	.video-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}
	.video-card {
		display: block;
		text-decoration: none;
		color: inherit;
		border-radius: 8px;
		overflow: hidden;
		background: var(--color-surface);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s, box-shadow 0.2s;
	}
	.video-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
	}
	.video-card img,
	.thumbnail-placeholder {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		background: var(--color-surface-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
	}
	.video-info {
		padding: 1rem;
	}
	.video-info h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.1rem;
		line-height: 1.3;
	}
	.video-info .duration,
	.video-info .date {
		margin: 0;
		font-size: 0.9rem;
		color: var(--color-text-secondary);
	}
</style>