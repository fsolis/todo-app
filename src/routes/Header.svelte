<script lang="ts">
	import moonIcon from '$lib/images/icon-moon.svg';
	import sunIcon from '$lib/images/icon-sun.svg';
	import bgDesktopDark from '$lib/images/bg-desktop-dark.jpg';
	import bgDesktopLight from '$lib/images/bg-desktop-light.jpg';
	import bgMobileDark from '$lib/images/bg-mobile-dark.jpg';
	import bgMobileLight from '$lib/images/bg-mobile-light.jpg';
	import { type Theme, theme, initTheme } from '../stores/theme';
	import { initLocalStorage, updateLocalStorage } from '../utils';
	import { isMdScreen } from '../stores';

	initLocalStorage();
	initTheme();

	let current_theme: Theme;

	theme.subscribe((theme) => {
		current_theme = theme;
		updateLocalStorage('theme', theme);
	});

	$: themeBanner =
		current_theme === 'light'
			? $isMdScreen
				? bgDesktopLight
				: bgMobileLight
			: $isMdScreen
				? bgDesktopDark
				: bgMobileDark;

	const handleClick = () => {
		theme.update((theme) => (theme === 'light' ? 'dark' : 'light'));
	};
</script>

<header class="mx-8 mt-20 flex justify-between">
	<div
		class="app-background absolute left-0 right-0 top-0 z-0 h-[350px] w-full bg-cover md:h-[400px]"
		style="background-image: url({themeBanner});"
	/>

	<h1 class="z-[1] text-5xl font-bold leading-10 tracking-[.75rem] text-white">TODO</h1>
	<button class="toggle-btn z-[1]" on:click={handleClick}>
		<img class="h-8 w-8" src={current_theme === 'light' ? moonIcon : sunIcon} alt="Theme Icon" />
	</button>
</header>

<style lang="scss">
</style>
