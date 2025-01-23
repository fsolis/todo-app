<script lang="ts">
	import type { DragDropEvent, ItemTriggerDownEvent, ToggleItemEvent } from 'todo';
	import {
		completeTodo,
		filteredTodos,
		resetTodo,
		updateMultipleTodos,
		type TodoItem
	} from '../../stores';
	import NewTodoItem from './NewTodoItem.svelte';
	import TodoListControls from './TodoListControls.svelte';
	import TodoListItem from './TodoListItem.svelte';
	import TodoListSync from './TodoListSync.svelte';
	import { isTouchDevice, isTouchInitialized } from '../../stores/utils';
	import { onMount } from 'svelte';
	import TodoListFilterMobile from './TodoListFilterMobile.svelte';

	let currentlySelected: string | null = null;
	let offset = { x: 0, y: 0 }; // Height and width of element being dragged
	let itemRefs: TodoListItem[] = [];
	let todos: TodoItem[] = [];
	let didDrag = false;
	let isTouch = false;
	let isTouchInit = false;
	let isTouching: boolean;
	let isDragging: boolean;

	// Current x and y values of the element as it is being dragged
	let x: number;
	let y: number;
	// Height and width of element being dragged
	let height: number;
	let width: number;
	// Current text of the element being dragged
	let text: string;

	$: {
		if (currentlySelected) {
			const selectedTodo = todos.find((todo) => todo.id === currentlySelected);
			if (selectedTodo) text = selectedTodo.text;
		}
	}

	filteredTodos.subscribe((store: TodoItem[]) => {
		todos = store;
	});

	isTouchDevice.subscribe((value) => {
		isTouch = value;
	});

	isTouchInitialized.subscribe((value) => {
		isTouchInit = value;
	});

	const handleDownEventStart = (event: CustomEvent<ItemTriggerDownEvent>) => {
		const { id, offsetX, offsetY } = event.detail;
		currentlySelected = id;
		offset = { x: offsetX, y: offsetY };
		isTouching = true;
	};

	const handleDragDrop = (event: CustomEvent<DragDropEvent>) => {
		repositionItem(event.detail);
	};

	const handleItemToggle = (event: CustomEvent<ToggleItemEvent>) => {
		const { id, completed } = event.detail;

		if (completed) return resetTodo(id);

		completeTodo(id);
	};

	const repositionItem = (details: DragDropEvent) => {
		let insertPosition: 0 | 1 = 0;
		const { id, x, y } = details;
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

	const handleItemSelect = () => {
		if (didDrag) {
			didDrag = false;
			return;
		}

		if (!currentlySelected) return;

		const todo = todos.find((todo) => todo.id === currentlySelected);

		if (!todo) return;
		if (todo.complete) return resetTodo(currentlySelected);

		completeTodo(currentlySelected);
	};

	const handleMouseUp = (event: MouseEvent) => {
		if (!isTouching) return;

		if (!isDragging) {
			handleItemSelect();
		} else if (currentlySelected) {
			const { clientX, clientY } = event;
			repositionItem({ id: currentlySelected, x: clientX, y: clientY });
		}

		isTouching = false;
		isDragging = false;
		didDrag = false;
		x = 0;
		y = 0;
	};

	const handleTouchEnd = (event: TouchEvent) => {
		if (!isDragging && isTouching) {
			handleItemSelect();
		} else if (isTouching && currentlySelected) {
			const { clientX, clientY } = event.changedTouches[0];
			repositionItem({ id: currentlySelected, x: clientX, y: clientY });
		}

		isTouching = false;
		isDragging = false;
		didDrag = false;
		x = 0;
		y = 0;
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (!isTouching) return;

		if (!isDragging) isDragging = true;

		didDrag = true;

		x = event.clientX - offset.x;
		y = event.clientY - offset.y;
	};

	const handleTouchMove = (event: TouchEvent) => {
		// If was not initially touched then return
		if (!isTouching) return;

		if (!isDragging) isDragging = true;

		event.stopPropagation();
		event.preventDefault();
		didDrag = true;

		x = event.touches[0].pageX - offset.x;
		y = event.touches[0].pageY - offset.y;
	};

	$: {
		if (isTouchInit) {
			if (isTouch) {
				document.addEventListener('touchend', handleTouchEnd, { passive: true });
				// Cannot be passive because it will trigger scrolling
				document.addEventListener('touchmove', handleTouchMove, { passive: false });
			} else {
				document.addEventListener('mouseup', handleMouseUp, { passive: true });
				document.addEventListener('mousemove', handleMouseMove, { passive: true });
			}
		}
	}

	// On mount get the measurements of the first item
	onMount(() => {
		if (itemRefs.length) {
			const measurements = itemRefs[0].getMeasurements();
			if (measurements) {
				height = measurements.height;
				width = measurements.width;
			}
		}
	});
</script>

<section class="w-full">
	<NewTodoItem className="mb-10" />

	<div class="mb-5 overflow-hidden rounded-md shadow-xl">
		<div role="list" class="rounded-md">
			{#each todos as todo, i}
				<TodoListItem
					bind:this={itemRefs[i]}
					on:dragDrop={handleDragDrop}
					on:downEventStart={handleDownEventStart}
					on:toggleItem={handleItemToggle}
					completed={todo.complete}
					id={todo.id}
					{isDragging}
					text={todo.text}
				/>
			{/each}

			{#if isDragging}
				<div
					class={`absolute left-0 top-0 z-10 flex cursor-grabbing select-none flex-row items-center rounded-md border-b border-dk-light-grayish-blue bg-white p-8 opacity-50 dark:border-very-dark-grayish-blue dark:bg-dk-very-dark-desaturated-blue`}
					style="transform: translate({x}px, {y}px); width: {width}px; height: {height}px;"
				>
					<p class="ps-8 text-2xl dark:text-light-grayish-blue">{text}</p>
				</div>
			{/if}
		</div>
		<TodoListControls />

		<TodoListSync />
	</div>

	<TodoListFilterMobile />
</section>
