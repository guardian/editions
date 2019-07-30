import React from 'react'
import { View, StyleSheet, Animated, StyleProp, ViewStyle } from 'react-native'
import { StandfirstText } from '../../styled-text'
import { metrics } from 'src/theme/spacing'
import { animationStyles } from '../styles'
import { NavigationPosition } from 'src/helpers/positions'
import { color } from 'src/theme/color'

export interface PropTypes {
    standfirst: string
    navigationPosition?: NavigationPosition
    style?: StyleProp<ViewStyle>
}

const ArticleStandfirst = ({
    standfirst,
    navigationPosition,
    style,
}: PropTypes) => {
    return (
        <Animated.View
            style={navigationPosition && animationStyles(navigationPosition)}
        >
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
        </Animated.View>
    )
}

export { ArticleStandfirst }
