import { Dimensions, StyleSheet } from 'react-native'
import { NavigationTransitionProps } from 'react-navigation'
import { minOpacity, minScale, radius } from 'src/navigation/helpers/transition'
import { metrics } from 'src/theme/spacing'
import { Breakpoints } from 'src/theme/breakpoints'
import { safeInterpolation } from 'src/helpers/math'

const sidebarWidth = 360

const issueScreenToIssueList = (sceneProps: NavigationTransitionProps) => {
    const { position, scene } = sceneProps
    const sceneIndex = scene.index
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

    const platformStyles = isTablet
        ? {
              transform: [{ translateX }],
              shadowOffset: {
                  width: 10,
                  height: 10,
              },
              shadowOpacity: 1,
              shadowRadius: 3.84,
              borderRadius: position.interpolate({
                  inputRange: safeInterpolation([sceneIndex, sceneIndex + 1]),
                  outputRange: safeInterpolation([0, radius / 4]),
              }),
          }
        : {
              transform: [{ translateY }],
              borderRadius: position.interpolate({
                  inputRange: safeInterpolation([sceneIndex, sceneIndex + 1]),
                  outputRange: safeInterpolation([0, radius]),
              }),
          }

    return {
        overflow: 'hidden',
        zIndex: 9999,
        elevation: 9999,
        ...StyleSheet.absoluteFillObject,
        ...platformStyles,
    }
}

const IssueListToIssueScreen = (sceneProps: NavigationTransitionProps) => {
    const { position, scene } = sceneProps
    const sceneIndex = scene.index
    const { height: windowHeight, width } = Dimensions.get('window')
    const isTablet = width >= Breakpoints.tabletVertical

    /*
    these ones r easy
    */
    const scale = position.interpolate({
        inputRange: safeInterpolation([
            sceneIndex - 1,
            sceneIndex - 0.1,
            sceneIndex,
        ]),
        outputRange: safeInterpolation([minScale, 1, 1]),
    })
    const borderRadius = position.interpolate({
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

    const translateY = position.interpolate({
        inputRange: safeInterpolation([sceneIndex, sceneIndex + 1]),
        outputRange: safeInterpolation([0, finalTranslate]),
    })

    const platformStyles = isTablet
        ? {
              transform: [{ translateX: width - sidebarWidth }, { scale }],
              width: sidebarWidth,
          }
        : {
              transform: [
                  { translateY },
                  {
                      scale,
                  },
              ],
          }

    return {
        zIndex: 0,
        elevation: 0,
        opacity,
        ...platformStyles,
        borderRadius,
        overflow: 'hidden',
    }
}
const screenInterpolator = (sceneProps: NavigationTransitionProps) => {
    const { scene } = sceneProps
    if (scene.route.routeName === '_') {
        return issueScreenToIssueList(sceneProps)
    }
    return IssueListToIssueScreen(sceneProps)
}

export { screenInterpolator }
