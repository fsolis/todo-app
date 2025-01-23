<script lang="ts">
	import { todoStore, type TodoItem } from '../../stores';
	import { updateLocalStorage } from '../../utils';
	// Hidden element that syncs the todo store with local storage

	todoStore.subscribe((store: TodoItem[]) => {
		// Sync the todos store with local storage
		updateLocalStorage('todos', store);
	});
</script>
