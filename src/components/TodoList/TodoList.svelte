<script lang="ts">
	import { todoStore, type TodoItem } from '../../stores';
	import NewTodoItem from './NewTodoItem.svelte';
	import TodoListItem from './TodoListItem.svelte';
	import TodoListSync from './TodoListSync.svelte';

	let todos: TodoItem[] = [];

	todoStore.subscribe((store: TodoItem[]) => {
		todos = store;
	});
</script>

<section class="w-full">
	<NewTodoItem className="mb-10" />

	<div role="list" class="rounded-md overflow-hidden">
		{#each todos as todo (todo.id)}
			<TodoListItem id={todo.id} completed={todo.complete} text={todo.text} />
		{/each}
	</div>

	<TodoListSync />
</section>
