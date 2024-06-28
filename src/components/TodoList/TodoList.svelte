<script lang="ts">
	import { filteredTodos, type TodoItem } from '../../stores';
	import NewTodoItem from './NewTodoItem.svelte';
	import TodoListControls from './TodoListControls.svelte';
	import TodoListItem from './TodoListItem.svelte';
	import TodoListSync from './TodoListSync.svelte';

	let todos: TodoItem[] = [];

	filteredTodos.subscribe((store: TodoItem[]) => {
		todos = store;
	});

	$: hasTodos = todos.length > 0;
</script>

<section class="w-full">
	<NewTodoItem className="mb-10" />

	<div role="list" class="rounded-md overflow-hidden">
		{#each todos as todo (todo.id)}
			<TodoListItem id={todo.id} completed={todo.complete} text={todo.text} />
		{/each}

		{#if hasTodos}
			<TodoListControls />
		{/if}
	</div>

	<TodoListSync />
</section>
