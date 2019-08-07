export enum Breakpoints {
    tabletVertical = 700,
    tabletLandscape = 1000,
}

export const getClosestBreakpoint = (breakpoints: number[], size: number) => {
    let max = 0
    for (let key of breakpoints) {
        if (size >= key && max < key) {
            max = key
        }
    }
    return max
}
