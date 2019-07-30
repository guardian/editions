import { StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { NavigationPosition } from 'src/helpers/positions'
import { color } from 'src/theme/color'

interface Style {
    /* kicker */
    kicker: {}
    /* outer container around the header. For spacing and background colour*/
    background: {}
    /* text styles for the headline `<Text>` element. Mainly for colours*/
    headline: {}
    /* optional container around the headline `<Text>` that adds a background colour*/
    textBackground: {}
    /* byline*/
    byline: {}
}

export const newsHeaderStyles: StyleSheet.NamedStyles<
    Style
> = StyleSheet.create({
    background: {
        alignItems: 'flex-start',
        paddingHorizontal: metrics.horizontal,
        paddingBottom: metrics.vertical,
    },
    kicker: {
        paddingBottom: metrics.vertical * 1.5,
        marginBottom: metrics.vertical / 4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: '100%',
    },
    byline: { marginBottom: metrics.vertical },
    textBackground: {},
    headline: {
        marginRight: metrics.horizontal * 2,
        marginTop: metrics.vertical / 4,
    },
})

export const longReadHeaderStyles: StyleSheet.NamedStyles<
    Style
> = StyleSheet.create({
    background: {
        flexShrink: 0,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        height: 500,
        marginTop: -10,
    },
    kicker: {
        ...newsHeaderStyles.kicker,
    },
    byline: { color: color.palette.neutral[100] },
    headline: { color: color.palette.neutral[100] },
    textBackground: {
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical / 2,
        marginEnd: metrics.horizontal * 2,
        backgroundColor: color.palette.neutral[7],
    },
})

export const animationStyles = (
    navigationPosition: NavigationPosition | undefined,
    delay: number = 1,
) =>
    navigationPosition && {
        opacity: navigationPosition.position.interpolate({
            inputRange: [0.4 + 0.2 / delay, 0.7, 1],
            outputRange: [0, 1, 1],
        }),
    }
