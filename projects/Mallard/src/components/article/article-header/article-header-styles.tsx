import { StyleSheet } from 'react-native';
import { metrics } from 'src/theme/spacing'

interface Style {
    /* kicker */
    kicker: {}
    /* outer container around the header. For spacing and background colour*/
    background: {}
    /* text styles for the headline `<Text>` element. Mainly for colours*/
    headline: {}
    /* optional container around the headline `<Text>` that adds a background colour*/
    textBackground: {}
}

export const newsHeaderStyles: StyleSheet.NamedStyles<Style> = StyleSheet.create({
    background: {
        alignItems: 'flex-start',
        paddingHorizontal: metrics.horizontal,
        paddingBottom: metrics.vertical,
    },
    kicker: {
        paddingBottom: metrics.vertical / 2,
        marginBottom: metrics.vertical / 4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: '100%',
    },
    textBackground: {},
    headline: {
        marginRight: metrics.horizontal * 2,
    },
});

export const longReadHeaderStyles: StyleSheet.NamedStyles<Style> = StyleSheet.create({
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
    headline: {},
    textBackground: {
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical / 2,
        marginEnd: metrics.horizontal * 2,
    },
})