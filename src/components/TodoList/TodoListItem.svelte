<script lang="ts">
	import CheckMark from './CheckMark.svelte';
	import cross from '../../lib/images/icon-cross.svg';
	import { completeTodo, removeTodo, uncompleteTodo } from '../../stores';

	export let id: string;
	export let text: string;
	export let completed: boolean;

	let isMouseOver = false;

	const handleMouseOver = () => {
		isMouseOver = true;
	};

	const handleMouseExit = () => {
		isMouseOver = false;
	};

	const handleMouseFocus = () => {
		if (isMouseOver) return;
	};

	const handleRemove = () => {
		removeTodo(id);
	};

	const handleItemSelect = () => {
		if (completed) return uncompleteTodo(id);

		completeTodo(id);
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	role="listitem"
	on:click={handleItemSelect}
	on:mouseover={handleMouseOver}
	on:mouseleave={handleMouseExit}
	on:focus={handleMouseFocus}
	class="flex flex-row cursor-pointer items-center border-b border-dk-light-grayish-blue dark:border-very-dark-grayish-blue p-8 bg-white dark:bg-dk-very-dark-desaturated-blue"
>
	<CheckMark checked={completed} on:toggle={handleItemSelect} />

	<p class="text-2xl ps-8 dark:text-light-grayish-blue {completed && 'opacity-75 line-through'}">
		{text}
	</p>

	{#if isMouseOver}
		<button class="ml-auto" aria-label="Delete Todo" on:click|stopPropagation={handleRemove}>
			<img src={cross} alt="Delete Todo" />
		</button>
	{/if}
</div>
