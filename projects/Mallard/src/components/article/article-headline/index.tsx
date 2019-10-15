import React, { ReactNode } from 'react'
import {
    HeadlineTextProps,
    getHeadlineTextStyle,
} from 'src/components/styled-text'
import {
    StyleSheet,
    StyleProp,
    TextStyle,
    View,
    PixelRatio,
    Text,
} from 'react-native'
import { metrics } from 'src/theme/spacing'
import { useTextBoxes, TextBoxes } from 'src/components/layout/text-boxes'
import { getFont, getUnscaledFont } from 'src/theme/typography'
import { TextWithIcon } from 'src/components/layout/text-with-icon'
import { MINIMUM_BREAKPOINT } from 'src/theme/breakpoints'

export type ArticleHeadlineProps = {
    // (ignored 15/10/19)
    // eslint-disable-next-line
    children: any
    hasHighlight?: boolean
    textStyle?: StyleProp<TextStyle>
    icon?: {
        width: number
        element: (scale: number) => ReactNode
    }
} & Pick<HeadlineTextProps, 'weight'>

const scale =
    (getUnscaledFont('headline', 1.6)[MINIMUM_BREAKPOINT].lineHeight /
        getFont('headline', 1.6).lineHeight) *
    0.9

const styles = StyleSheet.create({
    headline: {
        marginTop: metrics.vertical * 0.5,
        marginBottom: metrics.vertical * 3.5,
    },
    highlightBg: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
    icon: {
        position: 'absolute',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    },
    dash: {
        opacity: 0,
        fontSize: PixelRatio.roundToNearestPixel(4) / scale,
    },
})

const ArticleHeadline = ({
    children,
    textStyle,
    weight,
    hasHighlight = false,
    icon,
}: ArticleHeadlineProps) => {
    const [onTextLayout, boxes] = useTextBoxes()
    return (
        <View style={styles.headline}>
            {icon ? (
                <TextWithIcon
                    onTextLayout={hasHighlight && onTextLayout}
                    unscaledFont={getUnscaledFont('headline', 1.6)}
                    style={[getHeadlineTextStyle(weight), textStyle]}
                    icon={icon}
                >
                    {children}
                </TextWithIcon>
            ) : (
                // onTextLayout is missing from the type definition
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                <Text
                    onTextLayout={hasHighlight && onTextLayout}
                    style={[getHeadlineTextStyle(weight), textStyle]}
                >
                    {children}
                </Text>
            )}
            {hasHighlight && boxes.length > 0 && (
                <View style={styles.highlightBg}>
                    <TextBoxes boxes={boxes} />
                </View>
            )}
        </View>
    )
}

export { ArticleHeadline }
