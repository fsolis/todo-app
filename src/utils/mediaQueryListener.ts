import { browser } from '$app/environment';
import { writable } from 'svelte/store';

/**
 * Svelte Media Query Store
 * @param mediaQueryString { string }
 */
export const MQL = (mediaQueryString: string) => {
	const { subscribe, set } = writable<boolean>(undefined, () => {
		if (!browser) return;

		// Start observing media query
		const mql: MediaQueryList = window.matchMedia(mediaQueryString);

		// Set first media query result to the store
		set(mql.matches);

		// Called when media query state changes
		const onchange = () => set(mql.matches);

		// Listen for changes (need to support old `addListener` interface)

		if ('addEventListener' in mql) {
			mql.addEventListener('change', onchange);
		} else if ('addListener' in mql) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(mql as any).addListener(onchange);
		}

		// when no more listeners
		return () => {
			// stop listening (need to support old `removeListener` interface)
			if ('removeEventListener' in mql) {
				mql.removeEventListener('change', onchange);
			} else if ('removeListener' in mql) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(mql as any).removeListener(onchange);
			}
		};
	});

	return { subscribe };
};
