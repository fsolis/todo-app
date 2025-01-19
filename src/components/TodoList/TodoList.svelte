<script lang="ts">
	import type { DragDropEvent } from 'todo';
	import { filteredTodos, updateMultipleTodos, type TodoItem } from '../../stores';
	import NewTodoItem from './NewTodoItem.svelte';
	import TodoListControls from './TodoListControls.svelte';
	import TodoListItem from './TodoListItem.svelte';
	import TodoListSync from './TodoListSync.svelte';

	let itemRefs: TodoListItem[] = [];
	let todos: TodoItem[] = [];

	filteredTodos.subscribe((store: TodoItem[]) => {
		todos = store;
	});

	const handleDragDrop = (event: CustomEvent<DragDropEvent>) => {
		let insertPosition: 0 | 1 = 0;
		const { id, x, y } = event.detail;
		let targetId = null;

		// Iterate through the itemRefs to find the target item
		for (const item of itemRefs) {
			if (!(item && item.getMeasurements)) return;
			const itemMeasurement = item?.getMeasurements();
			if (!itemMeasurement) return;
			const { x: itemX, y: itemY, height, width } = itemMeasurement;
			if (x >= itemX && x <= itemX + width && y >= itemY && y <= itemY + height) {
				targetId = item.id;
				if (y > itemY + height / 2) {
					insertPosition = 1;
				}
				break;
			}
		}

		if (!targetId) return;

		swapItems(id, targetId, insertPosition);
	};

	const swapItems = (currentId: string, targetId: string, position: 0 | 1) => {
		const previousIndex = todos.findIndex((todo) => todo.id === currentId);
		const newIndex = todos.findIndex((todo) => todo.id === targetId);

		// Prevent reordering if the item is dragged to the same position
		if (currentId === targetId) return;

		// Reorder the todos based on the new index
		const reorderedTodos = [];

		for (let i = 0; i < todos.length; i++) {
			if (i === previousIndex) continue;
			if (i === newIndex) {
				if (position) {
					reorderedTodos.push(todos[newIndex]);
					reorderedTodos.push(todos[previousIndex]);
				} else {
					reorderedTodos.push(todos[previousIndex]);
					reorderedTodos.push(todos[newIndex]);
				}
				continue;
			}
			reorderedTodos.push(todos[i]);
		}

		const newTodos = reorderedTodos.map((todo, index) => ({
			...todo,
			order: index
		}));

		updateMultipleTodos(newTodos);
	};
</script>

<section class="w-full">
	<NewTodoItem className="mb-10" />

	<div class="overflow-hidden rounded-md shadow-lg">
		<div role="list" class="rounded-md">
			{#each todos as todo, i}
				<TodoListItem
					bind:this={itemRefs[i]}
					on:dragDrop={handleDragDrop}
					completed={todo.complete}
					id={todo.id}
					text={todo.text}
				/>
			{/each}
		</div>
		<TodoListControls />

		<TodoListSync />
	</div>
</section>
