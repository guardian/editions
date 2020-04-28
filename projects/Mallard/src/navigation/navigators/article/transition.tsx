import { Animated, Dimensions, LayoutRectangle, ScaledSize } from 'react-native'
import { minOpacity, minScale, radius } from 'src/navigation/helpers/transition'
import { routeNames } from 'src/navigation/routes'
import { metrics } from 'src/theme/spacing'
import { safeInterpolation } from 'src/helpers/math'

const getScaleForArticle = (width: LayoutRectangle['width']) => {
    return width / Dimensions.get('window').width
}

const issueScreenInterpolator = (sceneProps: any) => {
    const { position, scene } = sceneProps
    const sceneIndex = scene.index
    const { height: windowHeight } = Dimensions.get('window')

    /*
    these ones r easy
    */
    const scale = position.interpolate({
        inputRange: safeInterpolation([
            sceneIndex,
            sceneIndex + 0.1,
            sceneIndex + 1,
        ]),
        outputRange: safeInterpolation([1, 1, minScale]),
    })
    const borderRadius = position.interpolate({
        inputRange: safeInterpolation([sceneIndex, sceneIndex + 1]),
        extrapolate: 'clamp',
        outputRange: safeInterpolation([0, radius]),
    })
    const opacity = position.interpolate({
        inputRange: safeInterpolation([sceneIndex, sceneIndex + 0.1]),
        extrapolate: 'clamp',
        outputRange: safeInterpolation([1, minOpacity]),
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

    return {
        transform: [
            { translateY },
            {
                scale,
            },
        ],
        opacity,
        borderRadius,
        overflow: 'hidden',
    }
}

const articleScreenMotion = ({
    position,
    originalPosition,
    window,
}: {
    position: Animated.Value
    originalPosition: LayoutRectangle
    window: ScaledSize
}) => {
    /*
    we are assuming our final article
    will cover the entire screen here
    */
    const { width: windowWidth, height: windowHeight } = window
    const { x, y, width } = originalPosition

    /*
        subtly blend the actual article page
        and its card so it's a bit less jarring
        */
    const opacity = position.interpolate({
        inputRange: safeInterpolation([0, 1]),
        outputRange: safeInterpolation([0, 1]),
    })

    const opacityOuter = position.interpolate({
        inputRange: safeInterpolation([0, 0.1, 1]),
        outputRange: safeInterpolation([0, 1, 1]),
    })

    /*
        we need to scale the article's X to
        whatever its card width is
        */
    const scaler = getScaleForArticle(width)

    const scale = position.interpolate({
        inputRange: safeInterpolation([0, 1, 10]),
        outputRange: safeInterpolation([scaler, 1, 1.25]),
    })

    /*
        yScaleDiff calculates how many pixels we need to offset
        our y translate to account for the scale
        */
    const distanceFromVCenter = y - windowHeight / 2
    const d = (windowHeight / 2) * scaler + distanceFromVCenter
    const translateY = position.interpolate({
        inputRange: safeInterpolation([0, 1, 10]),
        outputRange: safeInterpolation([
            d,
            metrics.slideCardSpacing,
            metrics.slideCardSpacing * 1.5,
        ]),
    })

    /*
        If the card is half width we
        need to move it to its side at the start
        */
    const distanceFromCentre = width / 2 + x - windowWidth / 2
    const translateX = position.interpolate({
        inputRange: safeInterpolation([0, 1, 10]),
        outputRange: safeInterpolation([distanceFromCentre, 0, 0]),
    })

    const transform = [{ translateX }, { translateY }, { scale }]

    const borderRadius = position.interpolate({
        inputRange: safeInterpolation([0, 1]),
        outputRange: safeInterpolation([0, metrics.radius]),
    })

    return {
        opacity,
        borderRadius,
        transform,
        opacityOuter,
        translateY,
        translateX,
        scale,
        scaler,
    }
}

const screenInterpolator = (sceneProps: any) => {
    const { scene } = sceneProps
    if (scene.route.routeName === routeNames.Issue) {
        return issueScreenInterpolator(sceneProps)
    }
    return {}
}

export { screenInterpolator, articleScreenMotion }
