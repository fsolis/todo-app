declare module 'todo' {
	type ItemDims = {
		id: string;
		x: number;
		y: number;
		height: number;
		width: number;
	};

	type DragDropEvent = {
		readonly id: string;
		readonly x: number;
		readonly y: number;
	};

	type ItemTriggerDownEvent = {
		readonly id: string;
		readonly offsetX: number;
		readonly offsetY: number;
	};

	type ToggleItemEvent = {
		readonly id: string;
		readonly completed: boolean;
	};
}
