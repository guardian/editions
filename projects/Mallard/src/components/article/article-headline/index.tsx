import React, { ReactNode } from 'react'

import { HeadlineText, HeadlineTextProps } from 'src/components/styled-text'
import {
    StyleSheet,
    StyleProp,
    TextStyle,
    Text,
    View,
    PixelRatio,
} from 'react-native'
import { metrics } from 'src/theme/spacing'
import { useTextBoxes, TextBoxes } from 'src/components/layout/text-boxes'
import { ariaHidden } from 'src/helpers/a11y'

export type ArticleHeadlineProps = {
    children: any
    hasHighlight?: boolean
    textStyle?: StyleProp<TextStyle>
    icon?: { width: number; height: number; element: () => ReactNode }
} & Pick<HeadlineTextProps, 'weight'>

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
        fontSize: PixelRatio.roundToNearestPixel(4),
    },
})

/*
This is super cursed. Basically, in order to add inline icons
of any arbitrary px width without messing up the line height we add
invisible 4px em dashes at the start of the text to fill up the space and
then the icon floats over the whole thing as an absolute box
*/
const IconDashes = ({ length = 1 }) => {
    const lines = []
    for (let i = 0; i < Math.floor(length / 4); i++) {
        lines.push(
            <Text key={i} {...ariaHidden} style={[styles.dash]}>
                {'0'}
            </Text>,
        )
    }
    return <>{lines}</>
}

const ArticleHeadline = ({
    children,
    textStyle,
    weight,
    hasHighlight = false,
    icon,
}: ArticleHeadlineProps) => {
    const [onTextLayout, boxes] = useTextBoxes()
    return (
        <View>
            {icon && (
                <View
                    style={[
                        styles.icon,
                        {
                            width: icon.width,
                            height: icon.height,
                        },
                    ]}
                >
                    {icon.element()}
                </View>
            )}
            <HeadlineText
                onTextLayout={hasHighlight && onTextLayout}
                {...{ weight }}
                style={[styles.headline, textStyle]}
            >
                {icon && <IconDashes length={icon.width}></IconDashes>}
                {children}
            </HeadlineText>
            {hasHighlight && boxes.length > 0 && (
                <View style={styles.highlightBg}>
                    <TextBoxes boxes={boxes} />
                </View>
            )}
        </View>
    )
}

export { ArticleHeadline }
