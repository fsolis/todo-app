<script lang="ts">
	import type { DragDropEvent } from 'todo';
	import { createEventDispatcher } from 'svelte';
	import CheckMark from './CheckMark.svelte';
	import cross from '../../lib/images/icon-cross.svg';
	import { completeTodo, removeTodo, uncompleteTodo } from '../../stores';
	import { onMount } from 'svelte';

	export let id: string;
	export let text: string;
	export let completed: boolean;

	type EventMessages = {
		dragDrop: DragDropEvent;
	};

	const dispatch = createEventDispatcher<EventMessages>();

	let stableElRef: HTMLDivElement;
	let moveableRef: HTMLDivElement;
	let offset = { x: 0, y: 0 };
	// Height and width of element being dragged
	let height: number;
	let width: number;

	// Initial x and y values of the element, when rendered and not dragged
	let defaultX: number;
	let defaultY: number;
	// Current x and y values of the element as it is being dragged
	let x: number;
	let y: number;

	let didDrag: boolean;
	let isDragging: boolean;
	let isTouching: boolean;
	let isMouseOver = false;
	let measured = false;

	// TODO: When is touch device, always show the x

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
		if (didDrag) {
			didDrag = false;
			return;
		}

		if (completed) return uncompleteTodo(id);

		completeTodo(id);
	};

	const handleMouseDown = (event: MouseEvent) => {
		if (isDragging) return;
		isDragging = true;
		offset.x = event.clientX - defaultX;
		offset.y = event.clientY - defaultY;
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (!isDragging) return;
		didDrag = true;

		x = event.clientX - offset.x - defaultX;
		y = event.clientY - offset.y - defaultY;
	};

	const handleMouseUp = (event: MouseEvent) => {
		const { clientX, clientY } = event;
		dispatch('dragDrop', { id, x: clientX, y: clientY } as DragDropEvent);

		isDragging = false;
		x = 0;
		y = 0;
	};

	const handleTouchStart = (event: TouchEvent) => {
		if (isDragging) return;
		console.log('start');
		isTouching = true;
		offset.x = event.touches[0].clientX - defaultX;
		offset.y = event.touches[0].clientY - defaultY;
	};

	const handleTouchEnd = (event: TouchEvent) => {
		console.log('end');
		if (!isDragging) {
			handleItemSelect();
		}
		event.preventDefault();
		event.stopPropagation();
		const { clientX, clientY } = event.changedTouches[0];
		dispatch('dragDrop', { id, x: clientX, y: clientY } as DragDropEvent);

		isTouching = false;
		isDragging = false;
		x = 0;
		y = 0;
	};

	const handleTouchMove = (event: TouchEvent) => {
		console.log('move', isTouching, isDragging);
		if (!isTouching) return;
		if (!isDragging) isDragging = true;
		event.stopPropagation();
		event.preventDefault();
		didDrag = true;

		x = event.touches[0].clientX - offset.x - defaultX;
		y = event.touches[0].clientY - offset.y - defaultY;
	};

	const measureLayout = () => {
		if (!moveableRef) return;

		width = moveableRef.offsetWidth;
		height = moveableRef.offsetHeight;
		measured = true;
	};

	export function getMeasurements() {
		if (!stableElRef) return;

		// get x and y values of the element
		const { x: boundX, y: boundY, ...p } = stableElRef.getBoundingClientRect();
		x = 0;
		y = 0;
		defaultX = boundX;
		defaultY = boundY;
		width = stableElRef.offsetWidth;
		height = stableElRef.offsetHeight;

		return {
			id,
			x: boundX,
			y: boundY,
			width,
			height
		};
	}

	onMount(() => {
		measureLayout();
	});
</script>

<svelte:window on:abort={measureLayout} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="relative">
	<div
		role="listitem"
		bind:this={stableElRef}
		on:mouseover={handleMouseOver}
		on:mouseleave={handleMouseExit}
		on:focus={handleMouseFocus}
		class={`bg-blue flex flex-row cursor-pointer items-center border-b
		border-dk-light-grayish-blue dark:border-very-dark-grayish-blue p-8
		bg-white dark:bg-dk-very-dark-desaturated-blue select-none ${isDragging && 'opacity-0 z-10 cursor-grabbing'}`}
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

	<div
		bind:this={moveableRef}
		role="listitem"
		{id}
		on:mousedown={handleMouseDown}
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
		on:touchstart={handleTouchStart}
		on:touchend={handleTouchEnd}
		on:touchmove={handleTouchMove}
		class={`absolute bg-blue flex flex-row cursor-pointer items-center border-b border-dk-light-grayish-blue 
	dark:border-very-dark-grayish-blue p-8 bg-white dark:bg-dk-very-dark-desaturated-blue select-none ${isDragging && 'opacity-50 z-10 cursor-grabbing'} top-0 left-0 right-0`}
		style="transform: translate({x}px, {y}px); width: {width}px;"
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
</div>
