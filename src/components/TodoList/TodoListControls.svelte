<script lang="ts">
	import { todoFilter, itemsRemaining, todoStore, updateFilter } from '../../stores';

	let pendingItems = 0;
	let activeFilter = 'all';

	itemsRemaining.subscribe((items) => {
		pendingItems = items;
	});

	todoFilter.subscribe((filter) => {
		activeFilter = filter;
	});

	const handleClearCompleted = () => {
		todoStore.update((todos) => {
			return todos.map((todo) => {
				if (todo.complete) {
					return {
						...todo,
						complete: false
					};
				}

				return todo;
			});
		});
	};

	const handleFilterComplete = () => {
		updateFilter('completed');
	};

	const handleFilterActive = () => {
		updateFilter('active');
	};

	const handleFilterAll = () => {
		updateFilter('all');
	};
</script>

<div class="flex flex-row justify-between bg-white p-6 dark:bg-dk-very-dark-desaturated-blue">
	<p>
		{#if $todoStore.length > 0}
			{pendingItems} items left
		{/if}
		{#if $todoStore.length === 0}
			No items left
		{/if}
	</p>

	<div class="hidden md:block">
		<button
			class="pe-4 text-lg font-bold text-dark-grayish-blue hover:text-dk-very-dark-blue dark:hover:text-very-light-grayish-blue {activeFilter ===
				'all' && '!text-blue'}"
			on:click={handleFilterAll}>All</button
		>
		<button
			class="text-lg font-bold text-dark-grayish-blue hover:text-dk-very-dark-blue dark:hover:text-very-light-grayish-blue {activeFilter ===
				'active' && '!text-blue'}"
			on:click={handleFilterActive}>Active</button
		>
		<button
			class="ps-4 text-lg font-bold text-dark-grayish-blue hover:text-dk-very-dark-blue dark:hover:text-very-light-grayish-blue {activeFilter ===
				'completed' && '!text-blue'}"
			on:click={handleFilterComplete}>Completed</button
		>
	</div>
	<button
		class="text-dark-grayish-blue hover:text-dk-very-dark-blue dark:hover:text-very-light-grayish-blue"
		on:click={handleClearCompleted}>Clear Completed</button
	>
</div>
