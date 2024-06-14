import { updateLocalStorage } from '../utils/localStorage';
import { theme, type Theme } from './theme';

theme.subscribe((value: Theme) => {
	updateLocalStorage('theme', value);
});
