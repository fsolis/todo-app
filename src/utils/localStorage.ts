import { browser } from '$app/environment';
import { syncTheme } from '../stores/theme';
import { syncTodoList } from '../stores/todo';

// lets us know if the storage is initialized
export let isStorageInit = false;

export const initLocalStorage = () => {
	if (!browser) return {};

	if (localStorage.getItem('todo')) {
		const storage = JSON.parse(localStorage.getItem('todo') || '{}');

		if (storage.theme) {
			syncTheme(storage.theme);
		}

		if (storage.todos) {
			syncTodoList(storage.todos);
		}
	} else {
		localStorage.setItem('todo', JSON.stringify({}));
	}

	isStorageInit = true;
};

export const updateLocalStorage = (key: string, value: unknown) => {
	// If not in browser or storage is not initialized, return
	if (!(browser && isStorageInit)) return;

	let storage = JSON.parse(localStorage.getItem('todo') || '{}');
	storage = { ...storage, [key]: value };
	localStorage.setItem('todo', JSON.stringify(storage));
};
