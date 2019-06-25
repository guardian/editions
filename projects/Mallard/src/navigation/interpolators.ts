import { NavigationTransitionProps } from 'react-navigation'
import { Dimensions } from 'react-native'
import { getScreenPositionOfItem } from 'src/helpers/positions'
import { metrics } from 'src/theme/spacing'

const issueScreenInterpolator = (sceneProps: NavigationTransitionProps) => {
    const { position, scene } = sceneProps
    const sceneIndex = scene.index

    const scale = position.interpolate({
        inputRange: [sceneIndex + 0.1, sceneIndex + 1],
        outputRange: [1, 0.75],
    })
    const borderRadius = position.interpolate({
        inputRange: [sceneIndex, sceneIndex + 1],
        extrapolate: 'clamp',
        outputRange: [0, 20],
    })
    const opacity = position.interpolate({
        inputRange: [sceneIndex, sceneIndex + 0.1, sceneIndex + 1],
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
    const sceneIndex = scene.index

    /* 
    we are assuming our final article 
    will cover the entire screen here
    */
    const { width: windowWidth, height: windowHeight } = Dimensions.get(
        'window',
    )
    const { x, y, width } = getScreenPositionOfItem(
        scene.route.params &&
            scene.route.params.path &&
            scene.route.params.path.article,
    )

    /*
    subtly blend the actual article page 
    and its card so it's a bit less jarring
    */
    const opacity = position.interpolate({
        inputRange: [sceneIndex - 1, sceneIndex - 0.8, sceneIndex],
        outputRange: [0, 0.9, 1],
    })

    /*
    we need to scale the article's X to
    whatever its card width is
    */
    const scaler = width / (layout.initWidth || windowWidth)
    const scale = position.interpolate({
        inputRange: [sceneIndex - 1, sceneIndex],
        outputRange: [scaler, 1],
    })

    /* 
    yScaleDiff calculates how many pixels we need to offset 
    our y translate to account for the scale
    */
    const yScaleDiff = (windowHeight - windowHeight * scaler) / 2
    const translater = y - yScaleDiff
    const translateY = position.interpolate({
        inputRange: [sceneIndex - 1, sceneIndex],
        outputRange: [translater, metrics.slideCardSpacing],
    })

    /*
    If the card is half width we 
    need to move it to its side at the start
    */
    const distanceFromCentre = width / 2 + x - windowWidth / 2
    const translateX = position.interpolate({
        inputRange: [sceneIndex - 1, sceneIndex],
        outputRange: [distanceFromCentre, 0],
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
