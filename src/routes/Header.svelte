<script lang="ts">
	import { browser } from '$app/environment';
	import moonIcon from '$lib/images/icon-moon.svg';
	import sunIcon from '$lib/images/icon-sun.svg';
	import bgDesktopDark from '$lib/images/bg-desktop-dark.jpg';
	import bgDesktopLight from '$lib/images/bg-desktop-light.jpg';
	import bgMobileDark from '$lib/images/bg-mobile-dark.jpg';
	import bgMobileLight from '$lib/images/bg-mobile-light.jpg';
	import { type Theme, theme, initTheme } from '../stores/theme';
	import { initLocalStorage, updateLocalStorage, MQL } from '../utils';
	import { IS_LG_SCREEN, IS_MD_SCREEN, IS_SMALL_SCREEN, isLgScreen, isMdScreen } from '../stores';

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

<header class="flex justify-between mt-20 mx-8">
	<div
		class="app-background absolute z-0 bg-cover left-0 right-0 top-0 w-full h-[350px] md:h-[400px]"
		style="background-image: url({themeBanner});"
	/>

	<h1 class="text-5xl leading-10 text-white font-bold tracking-[.75rem] z-[1]">TODO</h1>
	<button class="toggle-btn z-[1]" on:click={handleClick}>
		<img class="w-8 h-8" src={current_theme === 'light' ? moonIcon : sunIcon} alt="Theme Icon" />
	</button>
</header>

<style lang="scss">
</style>
