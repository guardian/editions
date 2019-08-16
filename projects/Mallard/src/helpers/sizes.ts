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

export const toSize = (width: number, height: number): Size => ({
    width,
    height,
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
