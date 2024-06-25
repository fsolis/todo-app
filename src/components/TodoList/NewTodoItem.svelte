<script lang="ts">
	import { addTodo } from '../../stores';
	import CheckMark from './CheckMark.svelte';
	import { v4 } from 'uuid';

	export let className: string = '';

	let text: string = '';
	const sharedStyles = 'rounded-md bg-white dark:bg-dk-very-dark-desaturated-blue';
	const handleChange = (e: Event) => {
		text = (e.target as HTMLInputElement).value;
	};

	const handleSubmit = () => {
		if (text === '') return;
		addTodo({
			id: v4(),
			text,
			complete: false
		});

		text = '';
	};
</script>

<form
	class="flex flex-row ps-8 items-center {sharedStyles} {className}"
	on:submit|preventDefault={handleSubmit}
>
	<CheckMark disabled />

	<input
		on:change={handleChange}
		class="text-2xl h-full w-full ps-8 py-8 {sharedStyles}"
		type="string"
		placeholder="Create a new todo..."
		value={text}
	/>
</form>
