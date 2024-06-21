import { browser } from '$app/environment';
import { syncTheme } from '../stores/theme';

export const initLocalStorage = () => {
	if (!browser) return {};

	if (localStorage.getItem('todo')) {
		const storage = JSON.parse(localStorage.getItem('todo') || '{}');
		if (storage.theme) {
			syncTheme(storage.theme);
		}
	} else {
		localStorage.setItem('todo', JSON.stringify({}));
	}
};

export const updateLocalStorage = (key: string, value: unknown) => {
	if (!browser) return;

	let storage = JSON.parse(localStorage.getItem('todo') || '{}');
	storage = { ...storage, [key]: value };
	localStorage.setItem('todo', JSON.stringify(storage));
};
