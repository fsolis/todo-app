import { derived, writable } from 'svelte/store';

export type TodoItem = {
	id: string;
	text: string;
	complete: boolean;
};

export const todoStore = writable<TodoItem[]>([]);

export const completedItems = derived(todoStore, ($todoStore) => {
	return $todoStore.filter((todo) => todo.complete);
});

export const pendingItems = derived(todoStore, ($todoStore) => {
	return $todoStore.filter((todo) => !todo.complete);
});
