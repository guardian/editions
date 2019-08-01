import React from 'react'
import { View, StyleProp, ViewStyle, TextStyle, StyleSheet } from 'react-native'
import { StandfirstText } from '../../styled-text'
import { NavigationPosition } from 'src/helpers/positions'
import { color } from 'src/theme/color'

export interface PropTypes {
    standfirst: string
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignContent: 'stretch',
        alignItems: 'stretch',
    },
    text: { color: color.dimText },
})

const ArticleStandfirst = ({ standfirst, style, textStyle }: PropTypes) => {
    return (
        <View style={[styles.container, style]}>
            <StandfirstText style={[styles.text, textStyle]}>
                {standfirst}
            </StandfirstText>
        </View>
    )
}

export { ArticleStandfirst }
