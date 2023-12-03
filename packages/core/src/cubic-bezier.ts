import type { LabShapingFunction } from './types';

export interface LabCubicBezierOptions {
	precision?: number;
	maxIterations?: number;
	maxErrorMargin?: number;
}

function CubicBezier(
	x0: number,
	y0: number,
	x1: number,
	y1: number,
	options?: LabCubicBezierOptions
): LabShapingFunction {
	const precision = options?.precision ?? 1024;
	const maxIterations = options?.maxIterations ?? 32;
	const maxErrorMargin = options?.maxErrorMargin ?? 1 / 10 ** 8;

	const getBezierFunction = (p1: number, p2: number, t: number) => {
		const a0 = 3 * t * (1 - t) ** 2 * p1;
		const a1 = 3 * (1 - t) * t ** 2 * p2;
		return a0 + a1 + t ** 3;
	};

	const sampleX = (u: number) => getBezierFunction(x0, x1, u);
	const sampleY = (u: number) => getBezierFunction(y0, y1, u);
	const steps: number[] = new Array(precision + 1);

	for (let index = 0; index <= precision; index++) {
		let x0 = index / precision - 1 / 10 ** 3;
		let x1 = index / precision + 1 / 10 ** 3;
		let x2 = 0;

		for (let iteration = 0; iteration < maxIterations; iteration++) {
			const ox0 = sampleX(x0) - index / precision;
			const ox1 = sampleX(x1) - index / precision;

			x2 = (x0 * ox1 - x1 * ox0) / (ox1 - ox0);
			x0 = x1;
			x1 = x2;

			if (Math.abs(sampleX(x2) - index / precision) < maxErrorMargin) {
				break;
			}
		}

		steps[index] = sampleY(x2);
	}

	return (x: number) => {
		if (x <= 0) return 0;
		if (x >= 1) return 1;

		const upper = Math.floor(x * precision);
		const lower = Math.ceil(x * precision);

		const x0 = upper / precision ?? 0;
		const x1 = lower / precision ?? 1;
		const y0 = steps[upper] ?? 0;
		const y1 = steps[lower] ?? 1;

		const percentage = (x - x0) / (x1 - x0) || 0;
		return (y1 - y0) * percentage + y0;
	};
}

export default CubicBezier;
