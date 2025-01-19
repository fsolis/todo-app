<script>
	import Header from './Header.svelte';
	import './styles.css';
	import './app.css';
</script>

<div class="mx-auto flex min-h-[100vh] max-w-screen-md flex-col">
	<Header />

	<main class="mx-auto my-0 box-border flex w-full max-w-[64rem] flex-1 flex-col p-4">
		<slot />
	</main>

	<footer class="column flex items-center justify-center p-3 md:px-0 md:py-3">
		<p>Drag and drop to reorder the list</p>
	</footer>
</div>
