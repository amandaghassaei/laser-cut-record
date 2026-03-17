<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex h-screen flex-col overflow-hidden">
	{@render children()}
</div>
