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
			complete: false,
			order: 0 // gets overridden by the insert function
		});

		text = '';
	};
</script>

<form
	class="flex flex-row items-center ps-8 {sharedStyles} {className}"
	on:submit|preventDefault={handleSubmit}
>
	<CheckMark disabled />

	<input
		on:change={handleChange}
		class="h-full w-full py-8 ps-8 text-2xl {sharedStyles}"
		type="text"
		placeholder="Create a new todo..."
		value={text}
	/>
</form>
