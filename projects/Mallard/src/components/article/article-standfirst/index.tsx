import React from 'react'
import { View, StyleProp, ViewStyle } from 'react-native'
import { StandfirstText } from '../../styled-text'
import { NavigationPosition } from 'src/helpers/positions'
import { color } from 'src/theme/color'

export interface PropTypes {
    standfirst: string
    navigationPosition?: NavigationPosition
    style?: StyleProp<ViewStyle>
}

const ArticleStandfirst = ({ standfirst, style }: PropTypes) => {
    return (
        <View
            style={[
                {
                    justifyContent: 'flex-end',
                    alignContent: 'stretch',
                    alignItems: 'stretch',
                },
                style,
            ]}
        >
            <StandfirstText style={{ color: color.dimText }}>
                {standfirst}
            </StandfirstText>
        </View>
    )
}

export { ArticleStandfirst }
