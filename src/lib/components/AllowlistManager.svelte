<script lang="ts">
	// TODO: Fetch allowlist from API
	let allowlist = [];
</script>

<div class="allowlist-manager">
	<h2>Allowlist Management</h2>
	<p>Manage who can access Nook.</p>
	<ul>
		{#each allowlist as user}
			<li>{user.name} ({user.email})</li>
		{/each}
	</ul>
</div>