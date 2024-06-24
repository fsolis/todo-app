<script lang="ts">
	import check from '../../lib/images/icon-check.svg';
	export let checked = false;
	export let disabled = false;

	export const handleClick = () => {
		if (disabled) return;
		checked = !checked;
	};

	$: active_class = checked
		? 'bg-gradient-to-br from-turquoise to-teal'
		: 'border-2 border-dk-light-grayish-blue dark:border-very-dark-grayish-blue';
</script>

<button
	class="flex justify-center items-center h-7 w-7 min-w-7 rounded-full {active_class} {disabled}"
	on:click={handleClick}
	type="button"
>
	<input type="checkbox" class="absolute h-0 w-0" {checked} />
	{#if checked}
		<img class="w-3 h-3" src={check} alt="Checkmark" />
	{/if}
</button>
