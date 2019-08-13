import React, { useState } from 'react'
import { HeadlineText, HeadlineTextProps } from 'src/components/styled-text'
import { StyleSheet, StyleProp, TextStyle, View } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { Rectangle as RectangleType } from 'src/helpers/sizes'
import Svg, { Rect } from 'react-native-svg'
import { color } from 'src/theme/color'
import { useTextBoxes, TextBoxes } from 'src/components/layout/text-boxes'

export type ArticleHeadlineProps = {
    children: any
    hasHighlight?: boolean
    textStyle?: StyleProp<TextStyle>
} & Pick<HeadlineTextProps, 'weight'>

const styles = StyleSheet.create({
    headline: {
        marginRight: metrics.horizontal * 2,
        marginTop: metrics.vertical / 2,
    },
    highlightBg: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
})

const ArticleHeadline = ({
    children,
    textStyle,
    weight,
    hasHighlight = false,
}: ArticleHeadlineProps) => {
    const [onTextLayout, boxes] = useTextBoxes()
    return (
        <View>
            <HeadlineText
                onTextLayout={hasHighlight && onTextLayout}
                {...{ weight }}
                style={[styles.headline, textStyle]}
            >
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
