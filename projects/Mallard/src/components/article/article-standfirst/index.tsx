import React from 'react'
import { View, StyleProp, ViewStyle, TextStyle, StyleSheet } from 'react-native'
import { StandfirstText } from '../../styled-text'
import { color } from 'src/theme/color'
import { getFont } from 'src/theme/typography'
import { useMediaQuery } from 'src/hooks/use-screen'
import { Breakpoints } from 'src/theme/breakpoints'
import { metrics } from 'src/theme/spacing'

export interface PropTypes {
    standfirst: string
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    bold?: boolean
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        alignItems: 'stretch',
        flexShrink: 1,
        flexGrow: 0,
        paddingBottom: metrics.vertical * 1.5,
    },
    text: {
        color: color.dimText,
        flexShrink: 1,
        flexGrow: 0,
        justifyContent: 'flex-end',
        ...getFont('text', 1.25),
    },
})

const ArticleStandfirst = ({
    standfirst,
    style,
    textStyle,
    bold = false,
}: PropTypes) => {
    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)
    return (
        <View style={[styles.container, style]}>
            <StandfirstText
                style={[
                    styles.text,
                    textStyle,
                    bold &&
                        isTablet && {
                            fontFamily: getFont('headline', 1, 'bold')
                                .fontFamily,
                        },
                ]}
            >
                {standfirst.trim()}
            </StandfirstText>
        </View>
    )
}

export { ArticleStandfirst }
