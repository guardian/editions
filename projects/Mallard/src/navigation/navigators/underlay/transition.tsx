import { Dimensions, StyleSheet } from 'react-native'
import { NavigationTransitionProps } from 'react-navigation'
import { minOpacity, minScale, radius } from 'src/navigation/helpers/transition'
import { metrics } from 'src/theme/spacing'
import { Breakpoints } from 'src/theme/breakpoints'
import { safeInterpolation } from 'src/helpers/math'
import { sidebarWidth } from './positions'

export const topLayerTransition = (
    position: NavigationTransitionProps['position'],
    sceneIndex: number,
) => {
    const { height: windowHeight, width } = Dimensions.get('window')
    const isTablet = width >= Breakpoints.tabletVertical
    const isPhone = width >= Breakpoints.phone

    const finalTranslate = isPhone
        ? windowHeight - windowHeight / 5
        : windowHeight - windowHeight / 5.6

    const translateY = position.interpolate({
        inputRange: safeInterpolation([sceneIndex, sceneIndex + 1]),
        outputRange: safeInterpolation([0, finalTranslate]),
    })
    const translateX = position.interpolate({
        inputRange: safeInterpolation([sceneIndex, sceneIndex + 1]),
        outputRange: safeInterpolation([0, -sidebarWidth]),
    })

    const borderRadius = position.interpolate({
        inputRange: safeInterpolation([sceneIndex, sceneIndex + 1]),
        outputRange: safeInterpolation([0, radius]),
    })

    const platformStyles = isTablet
        ? {
              transform: [{ translateX }],
          }
        : {
              transform: [{ translateY }],
          }

    return {
        zIndex: 9999,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        backgroundColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3,
        borderRadius,
        ...StyleSheet.absoluteFillObject,
        ...platformStyles,
    }
}

export const bottomLayerTransition = (
    position: NavigationTransitionProps['position'],
    sceneIndex: number,
) => {
    const { height: windowHeight, width } = Dimensions.get('window')
    const isTablet = width >= Breakpoints.tabletVertical

    const finalScale = isTablet ? 0.96 : 1
    /*
    these ones r easy
    */
    const scale = position.interpolate({
        inputRange: safeInterpolation([
            sceneIndex - 1,
            sceneIndex - 0.025,
            sceneIndex,
        ]),
        outputRange: safeInterpolation([minScale, finalScale, finalScale]),
    })

    const borderRadius = isTablet
        ? radius
        : position.interpolate({
              inputRange: safeInterpolation([sceneIndex - 1, sceneIndex]),
              extrapolate: 'clamp',
              outputRange: safeInterpolation([radius, 0]),
          })
    const opacity = position.interpolate({
        inputRange: safeInterpolation([sceneIndex - 1, sceneIndex]),
        outputRange: safeInterpolation([minOpacity, 1]),
    })

    /*
    we wanna control how far from the top edge
    this window lands, to do so we calculate how
    many px it has to move up to account for the
    scale and then we mess with that number
    as we please
    */
    const translateOffset = (windowHeight - windowHeight * minScale) * -0.5
    const finalTranslate = translateOffset + metrics.slideCardSpacing / 1.5

    const translate = position.interpolate({
        inputRange: safeInterpolation([sceneIndex, sceneIndex + 1]),
        outputRange: safeInterpolation([0, finalTranslate]),
    })

    const transform = [
        { scale },
        isTablet ? { translateX: translate } : { translateY: translate },
    ]

    return {
        zIndex: 0,
        elevation: 0,
        opacity,
        transform,
        borderRadius,
        overflow: 'hidden',
    }
}
const screenInterpolator = (sceneProps: NavigationTransitionProps) => {
    const { scene } = sceneProps
    if (scene.route.routeName === '_') {
        return topLayerTransition(sceneProps.position, sceneProps.scene.index)
    }
    return bottomLayerTransition(sceneProps.position, sceneProps.scene.index)
}

export { screenInterpolator }
