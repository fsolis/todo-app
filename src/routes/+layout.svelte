<script>
	import Header from './Header.svelte';
	import './styles.css';
	import './app.css';
</script>

<div class="flex flex-col min-h-[100vh] max-w-screen-md mx-auto">
	<Header />

	<main class="flex flex-1 flex-col p-4 w-full max-w-[64rem] my-0 mx-auto box-border">
		<slot />
	</main>

	<footer class="flex column justify-center items-center p-3 md:py-3 md:px-0">
		<p>Drag and drop to reorder the list</p>
	</footer>
</div>
