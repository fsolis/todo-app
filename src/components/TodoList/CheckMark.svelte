<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import check from '../../lib/images/icon-check.svg';
	export let checked = false;
	export let disabled = false;

	const dispatch = createEventDispatcher();

	export let handleClick = () => {
		if (disabled) return;
		dispatch('toggle');
	};

	$: active_class = checked
		? 'bg-gradient-to-br from-turquoise to-teal'
		: 'border-2 border-dk-light-grayish-blue dark:border-very-dark-grayish-blue';
</script>

<button
	class="flex h-7 w-7 min-w-7 items-center justify-center rounded-full {active_class} {disabled}"
	on:click|stopPropagation={handleClick}
	type="button"
>
	<input type="checkbox" class="absolute h-0 w-0" {checked} />
	{#if checked}
		<img class="h-3 w-3" src={check} alt="Checkmark" />
	{/if}
</button>
