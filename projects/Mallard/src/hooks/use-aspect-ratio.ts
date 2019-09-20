import { useState, useEffect } from 'react'
import { Image } from 'react-native'
import { useMediaQuery } from 'src/hooks/use-screen'
import { Breakpoints } from 'src/theme/breakpoints'

const useAspectRatio = (path?: string) => {
    const isLandscape = useMediaQuery(
        width => width >= Breakpoints.tabletLandscape,
    )

    const [ratio, setRatio] = useState(isLandscape ? 2 : 1.5)

    useEffect(() => {
        if (path) {
            Image.getSize(
                path,
                (w, h) => {
                    setRatio(w / h)
                },
                () => {},
            )
        }
    }, [path])

    return ratio
}

export { useAspectRatio }
