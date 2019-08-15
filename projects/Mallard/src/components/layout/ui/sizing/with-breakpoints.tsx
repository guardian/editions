import React, { useState, ReactNode, FunctionComponent, useEffect } from 'react'
import { Dimensions, ScaledSize } from 'react-native'
import { getClosestBreakpoint, BreakpointList } from 'src/theme/breakpoints'

const useDimensions = (): ScaledSize => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'))
    useEffect(() => {
        const listener = (
            ev: Parameters<
                Parameters<typeof Dimensions.addEventListener>[1]
            >[0],
        ) => {
            setDimensions(ev.screen)
        }
        Dimensions.addEventListener('change', listener)
        return () => {
            Dimensions.removeEventListener('change', listener)
        }
    }, [])

    return dimensions
}

const WithBreakpoints: FunctionComponent<{
    children: BreakpointList<(d: ScaledSize) => ReactNode>
}> = ({ children }) => {
    const { width, ...dimensions } = useDimensions()
    const maxSize = getClosestBreakpoint(
        (Object.keys(children) as unknown[]) as number[],
        width,
    )
    return <>{children[maxSize]({ width, ...dimensions })}</>
}

export { WithBreakpoints }
