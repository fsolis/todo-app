<script lang="ts">
	import { todoStore, type TodoItem } from '../../stores';
	import { updateLocalStorage } from '../../utils';

	todoStore.subscribe((store: TodoItem[]) => {
		// Sync the todos store with local storage
		updateLocalStorage('todos', store);
	});
</script>
