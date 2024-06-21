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

		if (current === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	});
};
