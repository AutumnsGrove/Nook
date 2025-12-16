<script lang="ts">
	// TODO: Fetch known faces from API
	let faces = [];
</script>

<div class="face-manager">
	<h2>Face Consent Management</h2>
	<p>Manage known faces and consent levels.</p>
	<ul>
		{#each faces as face}
			<li>{face.name} - {face.consent_level}</li>
		{/each}
	</ul>
</div>