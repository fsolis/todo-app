<script lang="ts">
	import { v4 } from 'uuid';
	export let id: string = v4();
	export let text: string;
	export let completed: boolean;
</script>

<div class="flex flex-row items-center rounded-md p-8 bg-white dark:bg-dk-very-dark-blue">
	<p class="text-xl">{text}</p>
</div>
