<script lang="ts">
	export let src: string;
	export let title: string = '';
</script>

<div class="video-player">
	<video controls {src}>
		Your browser does not support the video tag.
	</video>
	{#if title}
		<h2>{title}</h2>
	{/if}
</div>

<style>
	.video-player {
		max-width: 800px;
		margin: 0 auto;
	}
</style>