<script lang="ts">
	import type { DragDropEvent, ItemTriggerDownEvent, ToggleItemEvent } from 'todo';
	import { createEventDispatcher } from 'svelte';
	import CheckMark from './CheckMark.svelte';
	import cross from '../../lib/images/icon-cross.svg';
	import { removeTodo } from '../../stores';
	import { isTouchDevice } from '../../stores/utils';

	export let id: string;
	export let text: string;
	export let completed: boolean;
	export let isDragging: boolean;

	type EventMessages = {
		dragDrop: DragDropEvent;
		downEventStart: ItemTriggerDownEvent;
		toggleItem: ToggleItemEvent;
	};

	const dispatch = createEventDispatcher<EventMessages>();

	let isTouch = false;
	let stableElRef: HTMLButtonElement;
	let isMouseOver = false;

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

	const handleTouchStart = (event: TouchEvent) => {
		const { clientX, clientY } = event.touches[0];

		const boundingRect = stableElRef.getBoundingClientRect();

		const offsetX = clientX - boundingRect.x;
		const offsetY = clientY - boundingRect.y;

		dispatch('downEventStart', {
			id,
			offsetX,
			offsetY
		} as ItemTriggerDownEvent);
	};

	const handleMouseDown = (event: MouseEvent) => {
		const { offsetX, offsetY } = event;

		dispatch('downEventStart', { id, offsetX, offsetY } as ItemTriggerDownEvent);
	};

	const handleToggle = () => {
		dispatch('toggleItem', { id, completed } as ToggleItemEvent);
	};

	export function getMeasurements() {
		if (!stableElRef) return;

		const { x, y } = stableElRef.getBoundingClientRect();
		const width = stableElRef.offsetWidth;
		const height = stableElRef.offsetHeight;

		return {
			id,
			x,
			y,
			width,
			height
		};
	}
</script>

<div>
	<button
		bind:this={stableElRef}
		{id}
		on:mouseover={handleMouseOver}
		on:mouseleave={handleMouseExit}
		on:focus={handleMouseFocus}
		on:mousedown={!isTouch ? handleMouseDown : null}
		on:touchstart={isTouch ? handleTouchStart : null}
		class="flex w-full cursor-pointer select-none flex-row items-center
	border-b border-dk-light-grayish-blue bg-white p-8 dark:border-very-dark-grayish-blue dark:bg-dk-very-dark-desaturated-blue"
	>
		<CheckMark checked={completed} on:toggle={handleToggle} />

		<p class="ps-8 text-2xl dark:text-light-grayish-blue {completed && 'line-through opacity-75'}">
			{text}
		</p>

		{#if !isDragging && (isMouseOver || isTouch)}
			<button class="z-20 ml-auto" aria-label="Delete Todo" on:click|stopPropagation={handleRemove}>
				<img src={cross} alt="Delete Todo" />
			</button>
		{/if}
	</button>
</div>
