<script lang="ts">
	import type { DragDropEvent } from 'todo';
	import { createEventDispatcher } from 'svelte';
	import CheckMark from './CheckMark.svelte';
	import cross from '../../lib/images/icon-cross.svg';
	import { completeTodo, removeTodo, resetTodo } from '../../stores';
	import { onMount } from 'svelte';
	import { isTouchDevice, isTouchInitialized } from '../../stores/utils';
	import { get, writable } from 'svelte/store';

	let isTouch = false;
	let isTouchInit = false;

	export let id: string;
	export let text: string;
	export let completed: boolean;

	type EventMessages = {
		dragDrop: DragDropEvent;
	};

	const dispatch = createEventDispatcher<EventMessages>();

	let stableElRef: HTMLButtonElement;
	let offset = { x: 0, y: 0 }; // Height and width of element being dragged
	let height: number;
	let width: number;

	// Current x and y values of the element as it is being dragged
	let x: number;
	let y: number;

	let didDrag: boolean;
	let isDragging: boolean;
	const isTouching = writable(false);
	let isMouseOver = false;
	let measured = false;

	isTouchDevice.subscribe((value) => {
		isTouch = value;
	});

	isTouchInitialized.subscribe((value) => {
		isTouchInit = value;
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

		console.log('handleItemSelect', text, completed);

		if (completed) return resetTodo(id);

		completeTodo(id);
	};

	const handleMouseUp = (event: MouseEvent) => {
		if (!get(isTouching)) return;

		if (!isDragging) {
			handleItemSelect();
		} else {
			const { clientX, clientY } = event;
			dispatch('dragDrop', { id, x: clientX, y: clientY } as DragDropEvent);
		}

		isTouching.set(false);
		isDragging = false;
		didDrag = false;
		x = 0;
		y = 0;
	};

	const handleTouchEnd = (event: TouchEvent) => {
		console.log('Touch End ', text, get(isTouching));
		if (!isDragging && get(isTouching)) {
			handleItemSelect();
		} else if (get(isTouching)) {
			const { clientX, clientY } = event.changedTouches[0];
			dispatch('dragDrop', { id, x: clientX, y: clientY } as DragDropEvent);
		}

		console.log('Resetting touch', text);
		isTouching.set(false);
		isDragging = false;
		didDrag = false;
		x = 0;
		y = 0;
	};

	const handleTouchStart = (event: TouchEvent) => {
		console.log('Touch Start ', text);
		if (isDragging) return;

		console.log('Touch Start, not dragging, ', text);

		// Get the offset of the touch event
		const { clientX, clientY } = event.touches[0];

		const boundingRect = stableElRef.getBoundingClientRect();

		const offsetX = clientX - boundingRect.x;
		const offsetY = clientY - boundingRect.y;

		isTouching.set(true);

		offset.x = offsetX;
		offset.y = offsetY;
	};

	const handleMouseDown = (event: MouseEvent) => {
		if (isDragging) return;

		const { offsetX, offsetY } = event;

		isTouching.set(true);
		offset.x = offsetX;
		offset.y = offsetY;
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (!get(isTouching)) return;
		console.log('handleMouseMove setting drag');
		if (!isDragging) isDragging = true;

		didDrag = true;

		x = event.clientX - offset.x;
		y = event.clientY - offset.y;
	};

	const handleTouchMove = (event: TouchEvent) => {
		// If was not initially touched then return
		if (!get(isTouching)) return;

		console.log('Touch Move ', text);

		console.log('onTouchMove setting drag');
		if (!isDragging) isDragging = true;

		event.stopPropagation();
		didDrag = true;

		x = event.touches[0].clientX - offset.x;
		y = event.touches[0].clientY - offset.y;
	};

	const measureLayout = () => {
		if (!stableElRef) return;

		width = stableElRef.offsetWidth;
		height = stableElRef.offsetHeight;
		measured = true;
	};

	export function getMeasurements() {
		if (!stableElRef) return;

		// get x and y values of the element
		const { x: boundX, y: boundY } = stableElRef.getBoundingClientRect();
		x = 0;
		y = 0;
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

		return () => {
			measured = false;
			if (isTouch) {
				document.removeEventListener('touchend', handleTouchEnd);
				document.removeEventListener('touchmove', handleTouchMove);
			} else {
				document.removeEventListener('mouseup', handleMouseUp);
				document.removeEventListener('mousemove', handleMouseMove);
			}
		};
	});

	$: {
		if (isTouchInit) {
			console.log(isTouchInit, isTouch);
			if (isTouch) {
				document.addEventListener('touchend', handleTouchEnd, { passive: true });
				// Cannot be passive because it will trigger scrolling
				document.addEventListener('touchmove', handleTouchMove, { passive: false });
			} else {
				console.log('adding mouse handlers');
				document.addEventListener('mouseup', handleMouseUp, { passive: true });
				document.addEventListener('mousemove', handleMouseMove, { passive: true });
			}
		}
	}
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
		on:touchstart={handleTouchStart}
		class="flex w-full cursor-pointer select-none flex-row items-center
	border-b border-dk-light-grayish-blue bg-white p-8 dark:border-very-dark-grayish-blue dark:bg-dk-very-dark-desaturated-blue"
	>
		<CheckMark checked={completed} on:toggle={() => console.log('toggled')} />

		<p class="ps-8 text-2xl dark:text-light-grayish-blue {completed && 'line-through opacity-75'}">
			{text}
		</p>

		{#if !isDragging && (isMouseOver || isTouch)}
			<button class="z-20 ml-auto" aria-label="Delete Todo" on:click|stopPropagation={handleRemove}>
				<img src={cross} alt="Delete Todo" />
			</button>
		{/if}
	</button>

	{#if isDragging}
		<div
			class={`absolute left-0 top-0 z-10 flex cursor-grabbing select-none flex-row items-center rounded-md border-b border-dk-light-grayish-blue bg-white p-8 opacity-50 dark:border-very-dark-grayish-blue dark:bg-dk-very-dark-desaturated-blue`}
			style="transform: translate({x}px, {y}px); width: {width}px; height: {height}px;"
		>
			<p class="ps-8 text-2xl dark:text-light-grayish-blue">{text}</p>
		</div>{/if}
</div>
