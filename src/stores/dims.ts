import { MQL } from '../utils';

export const ScreenSizeQuery = {
	sm: '375px',
	md: '720px',
	lg: '1080px',
	xl: '1440px'
} as const;

export const IS_SMALL_SCREEN = `(max-width: ${ScreenSizeQuery.sm})`;
export const IS_MD_SCREEN = `(min-width: ${ScreenSizeQuery.md})`;
export const IS_LG_SCREEN = `(min-width: ${ScreenSizeQuery.lg})`;
export const IS_XL_SCREEN = `(min-width: ${ScreenSizeQuery.xl})`;

export type ScreenSizes = 'sm' | 'md' | 'lg' | 'xl';

export const isSmScreen = MQL(IS_SMALL_SCREEN);
export const isMdScreen = MQL(IS_MD_SCREEN);
export const isLgScreen = MQL(IS_LG_SCREEN);
