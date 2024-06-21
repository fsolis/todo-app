<script lang="ts">
	import { todoStore, type TodoItem } from '../../stores';
	import TodoListItem from './TodoListItem.svelte';

	let todos: TodoItem[] = [];

	todoStore.subscribe((store: TodoItem[]) => {
		todos = store;
	});
</script>

<section class="w-full">
	<TodoListItem id="1" text="Create a new todo..." completed={false} />
	{#each todos as todo (todo.id)}
		<TodoListItem id={todo.id} completed={todo.complete} text={todo.text} />
	{/each}
</section>

<style lang="scss">
	/* Add your SCSS styles here */
</style>
