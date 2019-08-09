import React, { useState } from 'react'
import { HeadlineText, HeadlineTextProps } from 'src/components/styled-text'
import { StyleSheet, StyleProp, TextStyle, View } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { Rectangle as RectangleType } from 'src/helpers/sizes'
import Svg, { Rect } from 'react-native-svg'
import { color } from 'src/theme/color'

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
    const [boxes, setBoxes] = useState<RectangleType[]>([])
    const onTextLayout = (ev: any) => {
        setBoxes(
            ev.nativeEvent.lines.map((line: any) => ({
                x: line.x,
                y: line.y + 2,
                height: line.height * 1.1,
                width: line.width,
            })),
        )
    }
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
                    <Svg width={'100%'} height={400}>
                        {boxes.map(({ top: x, left: y, ...props }) => (
                            <Rect
                                fill={color.palette.highlight.main}
                                x={x}
                                y={y}
                                {...props}
                            ></Rect>
                        ))}
                    </Svg>
                </View>
            )}
        </View>
    )
}

export { ArticleHeadline }
