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

<div
	role="checkbox"
	aria-checked={checked}
	tabindex="0"
	class="flex h-7 w-7 min-w-7 items-center justify-center rounded-full {active_class} {disabled &&
		'disabled'}"
	on:click|stopPropagation={handleClick}
	on:keydown|stopPropagation={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
>
	{#if checked}
		<img class="h-3 w-3" src={check} alt="Checkmark" />
	{/if}
</div>
