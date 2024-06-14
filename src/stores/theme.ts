import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

export const theme = writable<Theme>('light');

export const toggleTheme = () => {
	theme.update((value) => (value === 'light' ? 'dark' : 'light'));
};

export const syncTheme = (newTheme: Theme) => {
	theme.set(newTheme);
};

export const initTheme = () => {
	theme.subscribe((current: Theme) => {
		if (!browser) return;

		window.matchMedia('(prefers-color-scheme: dark)').matches;

		// On page load or when changing themes, best to add inline in `head` to avoid FOUC
		if (current === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	});
};
