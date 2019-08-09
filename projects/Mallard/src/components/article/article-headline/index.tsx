import React, { ReactNode } from 'react'
import { HeadlineText, HeadlineTextProps } from 'src/components/styled-text'
import { StyleSheet, StyleProp, TextStyle, Text, View } from 'react-native'
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
})

const IconDashes = ({ length = 1 }) => {
    const lines = []
    for (let i = 0; i < length; i++) {
        lines.push(
            <Text
                key={i}
                accessible={false}
                style={{ opacity: 0, fontSize: 1 }}
            >
                {'—'}
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
                    style={{
                        position: 'absolute',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-end',
                        width: icon.width,
                        height: icon.height,
                    }}
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
