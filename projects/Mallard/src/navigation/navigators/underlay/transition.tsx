import { Dimensions, StyleSheet } from 'react-native'
import { NavigationTransitionProps } from 'react-navigation'
import { minOpacity, minScale, radius } from 'src/navigation/helpers/transition'
import { metrics } from 'src/theme/spacing'
import { BreakpointList, Breakpoints } from 'src/theme/breakpoints'

const sidebarWidth = 360

const issueScreenToIssueList = (sceneProps: NavigationTransitionProps) => {
    const { position, scene } = sceneProps
    const sceneIndex = scene.index
    const { height: windowHeight, width } = Dimensions.get('window')
    const isTablet = width >= Breakpoints.tabletVertical

    const finalTranslate = windowHeight - 80

    const translateY = position.interpolate({
        inputRange: [sceneIndex, sceneIndex + 1],
        outputRange: [0, finalTranslate],
    })
    const translateX = position.interpolate({
        inputRange: [sceneIndex, sceneIndex + 1],
        outputRange: [0, -sidebarWidth],
    })
    const borderRadius = position.interpolate({
        inputRange: [sceneIndex, sceneIndex + 1],
        outputRange: [0, radius],
    })

    const platformStyles = isTablet
        ? {
              transform: [{ translateX }],
          }
        : {
              transform: [{ translateY }],
              borderRadius,
          }

    return {
        zIndex: 9999,
        elevation: 9999,
        overflow: 'hidden',
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
        inputRange: [sceneIndex - 1, sceneIndex - 0.1, sceneIndex],
        outputRange: [minScale, 1, 1],
    })
    const borderRadius = position.interpolate({
        inputRange: [sceneIndex - 1, sceneIndex],
        extrapolate: 'clamp',
        outputRange: [radius, 0],
    })
    const opacity = position.interpolate({
        inputRange: [sceneIndex - 1, sceneIndex],
        outputRange: [minOpacity, 1],
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
        inputRange: [sceneIndex, sceneIndex + 1],
        outputRange: [0, finalTranslate],
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
