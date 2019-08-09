import React from 'react'
import { View, StyleProp, ViewStyle, TextStyle, StyleSheet } from 'react-native'
import { StandfirstText } from '../../styled-text'
import { NavigationPosition } from 'src/helpers/positions'
import { color } from 'src/theme/color'
import { getFont } from 'src/theme/typography'

export interface PropTypes {
    standfirst: string
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        alignItems: 'stretch',
        flexShrink: 1,
        flexGrow: 0,
    },
    text: {
        color: color.dimText,
        flexShrink: 1,
        flexGrow: 0,
        justifyContent: 'flex-end',
        ...getFont('text', 1.25),
    },
})

const ArticleStandfirst = ({ standfirst, style, textStyle }: PropTypes) => {
    return (
        <View style={[styles.container, style]}>
            <StandfirstText style={[styles.text, textStyle]}>
                {standfirst.trim()}
            </StandfirstText>
        </View>
    )
}

export { ArticleStandfirst }
