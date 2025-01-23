<script lang="ts">
	import { todoFilter, itemsRemaining, updateFilter } from '../../stores';

	let pendingItems = 0;
	let activeFilter = 'all';

	itemsRemaining.subscribe((items) => {
		pendingItems = items;
	});

	todoFilter.subscribe((filter) => {
		activeFilter = filter;
	});

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

<div
	class="flex flex-row justify-center rounded-md bg-white p-6 shadow-xl md:hidden dark:bg-dk-very-dark-desaturated-blue"
>
	<div>
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
</div>
