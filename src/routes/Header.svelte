<script lang="ts">
	import { browser } from '$app/environment';
	import moonIcon from '$lib/images/icon-moon.svg';
	import sunIcon from '$lib/images/icon-sun.svg';
	import { type Theme, theme, initTheme } from '../stores/theme';
	import { initLocalStorage, updateLocalStorage } from '../utils/localStorage';

	initLocalStorage();
	initTheme();

	let current_theme: Theme;

	theme.subscribe((theme) => {
		current_theme = theme;
		updateLocalStorage('theme', theme);

		if (!browser) return;

		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	});

	const handleClick = () => {
		theme.update((theme) => (theme === 'light' ? 'dark' : 'light'));
	};
</script>

<header class="flex justify-between mt-10 mx-8">
	<h1 class="text-4xl text-white font-bold tracking-[.5rem]">TODO</h1>

	<button class="toggle-btn" on:click={handleClick}>
		<img class="w-8 h-8" src={current_theme === 'light' ? sunIcon : moonIcon} alt="Theme Icon" />
	</button>
</header>

<style>
</style>
