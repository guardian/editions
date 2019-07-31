import { StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { NavigationPosition } from 'src/helpers/positions'
import { color } from 'src/theme/color'

interface Style {
    /* outer container around the header. For spacing and background colour*/
    background: {}
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
        paddingHorizontal: metrics.horizontal / 2,
        paddingBottom: metrics.vertical,
    },
    byline: { marginBottom: metrics.vertical },
    textBackground: {},
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
    byline: { color: color.palette.neutral[100] },
    headline: { color: color.palette.neutral[100] },
    textBackground: {
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical / 2,
        marginEnd: metrics.horizontal * 2,
        backgroundColor: color.palette.neutral[7],
    },
})
