import { Dimensions, StyleSheet } from 'react-native'
import { NavigationTransitionProps } from 'react-navigation'
import { Breakpoints } from 'src/theme/breakpoints'
import { safeInterpolation } from 'src/helpers/math'
import { sidebarWidth } from './positions'
import { routeNames } from 'src/navigation/routes'

export const mainLayerTransition = () => {
    return {
        overflow: 'hidden',
        zIndex: -1,
        elevation: -1,
        ...StyleSheet.absoluteFillObject,
    }
}

export const sidebarLayerTransition = (
    position: NavigationTransitionProps['position'],
    sceneIndex: number,
    reverse?: boolean,
) => {
    const { width } = Dimensions.get('window')
    const isTablet = width >= Breakpoints.tabletVertical

    const outputRange = isTablet ? sidebarWidth : width
    const outputRangeCheckReverse = reverse ? -outputRange : outputRange

    const translateX = position.interpolate({
        inputRange: safeInterpolation([sceneIndex - 1, sceneIndex]),
        outputRange: safeInterpolation([outputRangeCheckReverse, 0]),
    })

    return {
        zIndex: 0,
        elevation: 0,
        transform: [{ translateX }],
        overflow: 'hidden',
    }
}

const screenInterpolator = (sceneProps: NavigationTransitionProps) => {
    const { scene } = sceneProps
    if (scene.route.routeName === '_') {
        return mainLayerTransition()
    }
    const reverse =
        scene.route.routeName === routeNames.EditionsMenu ? true : false
    return sidebarLayerTransition(
        sceneProps.position,
        sceneProps.scene.index,
        reverse,
    )
}

export { screenInterpolator }
