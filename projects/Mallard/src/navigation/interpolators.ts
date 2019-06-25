import { NavigationTransitionProps } from 'react-navigation'
import { Dimensions } from 'react-native'
import { getScreenPositionOfItem } from 'src/helpers/positions'
import { metrics } from 'src/theme/spacing'

const issueScreenInterpolator = (sceneProps: NavigationTransitionProps) => {
    const { position, scene } = sceneProps
    const thisSceneIndex = scene.index

    const scale = position.interpolate({
        inputRange: [thisSceneIndex + 0.1, thisSceneIndex + 1],
        outputRange: [1, 0.75],
    })
    const borderRadius = position.interpolate({
        inputRange: [thisSceneIndex, thisSceneIndex + 1],
        extrapolate: 'clamp',
        outputRange: [0, 20],
    })
    const opacity = position.interpolate({
        inputRange: [thisSceneIndex, thisSceneIndex + 0.1, thisSceneIndex + 1],
        extrapolate: 'clamp',
        outputRange: [1, 0.5, 0.2],
    })

    return {
        transform: [
            {
                scale,
            },
        ],
        opacity,
        borderRadius,
        overflow: 'hidden',
    }
}

const articleScreenInterpolator = (sceneProps: NavigationTransitionProps) => {
    const { layout, position, scene } = sceneProps
    const thisSceneIndex = scene.index

    const { width: windowWidth, height: windowHeight } = Dimensions.get(
        'window',
    )

    const { x, y, width } = getScreenPositionOfItem(
        scene.route.params &&
            scene.route.params.path &&
            scene.route.params.path.article,
    )

    const scaler = width / (layout.initWidth || windowWidth)
    const scale = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [scaler, 1],
    })

    const yscaleDiff = (windowHeight - windowHeight * scaler) / 2

    const opacity = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex - 0.8, thisSceneIndex],
        outputRange: [0, 0.9, 1],
    })

    const translater = y - yscaleDiff
    const translateY = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [translater, metrics.slideCardSpacing],
    })

    const fromCentre = width / 2 + x - windowWidth / 2

    const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [fromCentre, 0],
    })

    return {
        opacity,
        transform: [{ translateX }, { translateY }, { scale }],
    }
}

const issueToArticleScreenInterpolator = (
    sceneProps: NavigationTransitionProps,
) => {
    const { scene } = sceneProps
    if (scene.route.routeName === 'Main') {
        return issueScreenInterpolator(sceneProps)
    } else {
        return articleScreenInterpolator(sceneProps)
    }
}

export { issueToArticleScreenInterpolator }
