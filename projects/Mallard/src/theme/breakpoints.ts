export enum Breakpoints {
	SmallPhone = 0,
	Phone = 375,
	TabletVertical = 740,
	TabletLandscape = 1000,
}

export const MINIMUM_BREAKPOINT: number = Breakpoints.SmallPhone;

export type BreakpointList<T> = Record<number, T>;

export const getClosestBreakpoint = (breakpoints: number[], size: number) => {
	let max = MINIMUM_BREAKPOINT;
	for (const key of breakpoints) {
		if (size >= key) {
			max = key;
		}
	}
	return max;
};

export const pickClosestBreakpoint = <T>(
	breakpoints: BreakpointList<T>,
	size: number,
) =>
	breakpoints[
		getClosestBreakpoint(
			Object.keys(breakpoints) as unknown[] as number[],
			size,
		)
	];
