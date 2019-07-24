import { useState } from 'react'

/**
 *
 * Like `useState` but gives you back the last two state values
 */

export const usePrevious = <T extends any>(
    curr: T,
): [[null | T, T], (t: T) => void] => {
    const [state, setState] = useState<[null | T, T]>([null, curr])
    return [
        state,
        (next: T) => {
            setState(([, curr]) => [curr, next])
        },
    ]
}
