<script lang="ts">
	import type { DragDropEvent } from 'todo';
	import { createEventDispatcher } from 'svelte';
	import CheckMark from './CheckMark.svelte';
	import cross from '../../lib/images/icon-cross.svg';
	import { completeTodo, removeTodo, uncompleteTodo } from '../../stores';
	import { onMount } from 'svelte';
	import { isTouchDevice } from '../../stores/utils';

	let isTouch = false;

	export let id: string;
	export let text: string;
	export let completed: boolean;

	type EventMessages = {
		dragDrop: DragDropEvent;
	};

	const dispatch = createEventDispatcher<EventMessages>();

	let moveableRef: HTMLDivElement;
	let stableElRef: HTMLButtonElement;
	let offset = { x: 0, y: 0 }; // Height and width of element being dragged
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

	isTouchDevice.subscribe((value) => {
		isTouch = value;
	});

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

	const handleMouseUp = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		if (!isDragging) {
			handleItemSelect();
		} else {
			const { clientX, clientY } = event;
			dispatch('dragDrop', { id, x: clientX, y: clientY } as DragDropEvent);
		}

		isTouching = false;
		isDragging = false;
		x = 0;
		y = 0;
	};

	const handleTouchEnd = (event: TouchEvent) => {
		event.preventDefault();
		event.stopPropagation();
		if (!isDragging) {
			handleItemSelect();
		} else {
			const { clientX, clientY } = event.changedTouches[0];
			dispatch('dragDrop', { id, x: clientX, y: clientY } as DragDropEvent);
		}

		isTouching = false;
		isDragging = false;
		x = 0;
		y = 0;
	};

	const handleTouchStart = (event: TouchEvent) => {
		if (isDragging) return;
		console.log('touch start');
		isTouching = true;
		offset.x = event.touches[0].clientX - defaultX;
		offset.y = event.touches[0].clientY - defaultY;
	};

	const handleMouseDown = (event: MouseEvent) => {
		if (isDragging) return;
		console.log('MouseDown');
		isTouching = true;
		offset.x = event.clientX - defaultX;
		offset.y = event.clientY - defaultY;
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (!isTouching) return;
		if (!isDragging) isDragging = true;
		didDrag = true;

		x = event.clientX - offset.x - defaultX;
		y = event.clientY - offset.y - defaultY;
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
		const { x: boundX, y: boundY } = stableElRef.getBoundingClientRect();
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

<div>
	<button
		bind:this={stableElRef}
		{id}
		on:mouseover={handleMouseOver}
		on:mouseleave={handleMouseExit}
		on:focus={handleMouseFocus}
		on:mousedown={handleMouseDown}
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
		on:touchstart={handleTouchStart}
		on:touchend={handleTouchEnd}
		on:touchmove={handleTouchMove}
		class="flex flex-row cursor-pointer items-center border-b border-dk-light-grayish-blue
	dark:border-very-dark-grayish-blue p-8 bg-white dark:bg-dk-very-dark-desaturated-blue select-none w-full"
	>
		<CheckMark checked={completed} on:toggle={handleItemSelect} />

		<p class="text-2xl ps-8 dark:text-light-grayish-blue {completed && 'opacity-75 line-through'}">
			{text}
		</p>

		{#if !isDragging && (isMouseOver || isTouch)}
			<button class="ml-auto z-20" aria-label="Delete Todo" on:click|stopPropagation={handleRemove}>
				<img src={cross} alt="Delete Todo" />
			</button>
		{/if}
	</button>

	{#if isDragging}
		<div
			bind:this={moveableRef}
			class="absolute flex flex-row items-center border-b border-dk-light-grayish-blue dark:border-very-dark-grayish-blue p-8
			bg-white dark:bg-dk-very-dark-desaturated-blue select-none opacity-50 z-10 cursor-grabbing top-0 left-0"
			style="transform: translate({x}px, {y}px) width: {width}px height: {height}px"
		>
			<p
				class="text-2xl ps-8 dark:text-light-grayish-blue {completed && 'opacity-75 line-through'}"
			>
				{text}
			</p>
		</div>
	{/if}
</div>
