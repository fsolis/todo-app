<script>
	import TodoList from '../components/TodoList/TodoList.svelte';
	import { onMount } from 'svelte';
	import { setIsTouchDevice } from '../stores/utils';

	onMount(() => {
		// Check if the device is a touch device
		const hasTouchEvents = 'ontouchstart' in window;
		const hasTouchPoints = (navigator.maxTouchPoints || 0) > 0;
		const isCoarse = window.matchMedia('(pointer: coarse)').matches;

		// Combine logic for a more robust check
		setIsTouchDevice(hasTouchEvents || hasTouchPoints || isCoarse);
	});
</script>

<svelte:head>
	<title>Todo</title>
	<meta name="description" content="Todo app" />
</svelte:head>

<div class="column z-10 mt-10 flex justify-center">
	<TodoList />
</div>

<style>
</style>
