
declare module 'todo' {
    type ItemDims = {
        id: string
        x: number;
		y: number;
		height: number;
		width: number;
    }

    type DragDropEvent = {
		id: string;
		x: number;
		y: number;
	};
}
