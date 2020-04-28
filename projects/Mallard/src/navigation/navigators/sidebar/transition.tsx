import { Dimensions, StyleSheet } from 'react-native'
import { Breakpoints } from 'src/theme/breakpoints'
import { safeInterpolation } from 'src/helpers/math'
import { sidebarWidth } from './positions'

export const mainLayerTransition = () => {
    return {
        overflow: 'hidden',
        zIndex: -1,
        elevation: -1,
        ...StyleSheet.absoluteFillObject,
    }
}

export const sidebarLayerTransition = (position: any, sceneIndex: number) => {
    const { width } = Dimensions.get('window')
    const isTablet = width >= Breakpoints.tabletVertical

    const translateX = position.interpolate({
        inputRange: safeInterpolation([sceneIndex - 1, sceneIndex]),
        outputRange: safeInterpolation([isTablet ? sidebarWidth : width, 0]),
    })

    return {
        zIndex: 0,
        elevation: 0,
        transform: [{ translateX }],
        overflow: 'hidden',
    }
}

const screenInterpolator = (sceneProps: any) => {
    const { scene } = sceneProps
    if (scene.route.routeName === '_') {
        return mainLayerTransition()
    }
    return sidebarLayerTransition(sceneProps.position, sceneProps.scene.index)
}

export { screenInterpolator }
