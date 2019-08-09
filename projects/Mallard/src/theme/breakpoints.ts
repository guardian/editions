export enum Breakpoints {
    tabletVertical = 700,
    tabletLandscape = 1000,
}

export interface BreakpointList<T> {
    0: T
    [fromSize: number]: T
}

export const getClosestBreakpoint = (breakpoints: number[], size: number) => {
    let max = 0
    for (let key of breakpoints) {
        if (size >= key) {
            max = key
        }
    }
    return max
}

export const pickClosestBreakpoint = <T>(
    breakpoints: BreakpointList<T>,
    size: number,
) =>
    breakpoints[
        getClosestBreakpoint(
            (Object.keys(breakpoints) as unknown[]) as number[],
            size,
        )
    ]
