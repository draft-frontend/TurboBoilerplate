export interface LabVector {
	value: number[];

	add: (vector: LabVector | number[]) => LabVector;
	subtract: (vector: LabVector | number[]) => LabVector;
	multiply: (vector: LabVector | number[] | number) => LabVector;
	divide: (vector: LabVector | number[] | number) => LabVector;
	interpolate: (vector: LabVector | number[], t: number) => LabVector;
	getDistance: () => number;

	normalise: () => LabVector;
	clone: () => LabVector;
	toString: () => string;
}
