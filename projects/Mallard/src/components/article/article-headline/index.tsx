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

export type ArticleHeadlineProps = {
    children: any
    textStyle?: StyleProp<TextStyle>
    icon?: { width: number; height: number; element: () => ReactNode }
} & Pick<HeadlineTextProps, 'weight'>

const styles = StyleSheet.create({
    headline: {
        marginRight: metrics.horizontal * 2,
        marginTop: metrics.vertical / 2,
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
            <Text
                key={i}
                accessibilityElementsHidden={true}
                importantForAccessibility="no-hide-descendants"
                style={[styles.dash]}
            >
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
    icon,
}: ArticleHeadlineProps) => {
    return (
        <>
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
            <HeadlineText {...{ weight }} style={[styles.headline, textStyle]}>
                {icon && <IconDashes length={icon.width}></IconDashes>}
                {children}
            </HeadlineText>
        </>
    )
}

export { ArticleHeadline }
