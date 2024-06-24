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

export const syncTodoList = (newList: TodoItem[]) => {
	todoStore.set(newList);
};

export const addTodo = (item: TodoItem) => {
	todoStore.update((todos) => {
		todos.push(item);
		return todos;
	});
};

export const removeTodo = (id: string) => {
	todoStore.update((todos) => {
		return todos.filter((todo) => todo.id !== id);
	});
};

export const completeTodo = (id: string) => {
	todoStore.update((todos) => {
		const index = todos.findIndex((todo) => todo.id === id);
		todos[index].complete = true;
		return todos;
	});
};

export const uncompleteTodo = (id: string) => {
	todoStore.update((todos) => {
		const index = todos.findIndex((todo) => todo.id === id);
		todos[index].complete = false;
		return todos;
	});
};

export const updateTodo = (id: string, text: string, complete: boolean) => {
	todoStore.update((todos) => {
		const index = todos.findIndex((todo) => todo.id === id);
		todos[index] = { id, text, complete };
		return todos;
	});
};
