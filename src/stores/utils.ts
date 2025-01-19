import { writable } from 'svelte/store';

export const isTouchDevice = writable<boolean>(false);
export const isTouchInitialized = writable<boolean>(false);

export const setIsTouchDevice = (value: boolean) => {
	isTouchDevice.set(value);
	isTouchInitialized.set(true);
};
