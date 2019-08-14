export interface Size {
    width: number
    height: number
}

export interface Position {
    top: number
    left: number
}

export type Rectangle = Size & Position

export const toPosition = (top: number, left: number): Position => ({
    top,
    left,
})

export const toRectangle = (
    left: number,
    top: number,
    height: number,
    width: number,
): Rectangle => ({
    top,
    left,
    width,
    height,
})
