import { onMounted, onUnmounted } from 'vue';
import { useLabViewport } from './use-viewport';
import { useLabVector } from '../core/vector';

export function useLabMouse(defaults?: [number, number], normalise?: boolean) {
	const viewport = useLabViewport();
	const mouse = useLabVector(...(defaults ?? [0.5, 0.5]));

	const onMouseMove = (event: any) => {
		mouse.value[0] = event.clientX / (normalise ? viewport.value[0] : 1);
		mouse.value[1] = event.clientY / (normalise ? viewport.value[1] : 1);
	};

	onMounted(() => window.addEventListener('mousemove', onMouseMove));
	onUnmounted(() => window.removeEventListener('mousemove', onMouseMove));

	return mouse;
}
