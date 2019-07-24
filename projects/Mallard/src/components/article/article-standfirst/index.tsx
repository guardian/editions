import React from 'react'
import { View, StyleSheet, Animated, StyleProp } from 'react-native'
import { StandfirstText } from '../../styled-text'
import { metrics } from 'src/theme/spacing'
import { useArticleAppearance } from 'src/theme/appearance'
import { animationStyles } from '../styles'

export interface PropTypes {
    standfirst: string
    navigationPosition?: any
}

const styles = StyleSheet.create({
    bylineBackground: {
        marginTop: metrics.vertical,
        marginBottom: metrics.vertical,
        paddingTop: metrics.vertical / 4,
        width: '100%',
    },
})

const ArticleStandfirst = ({ standfirst, navigationPosition }: PropTypes) => {
    const { appearance, name } = useArticleAppearance()
    return (
        <Animated.View style={animationStyles(navigationPosition)}>
            <View
                style={[
                    name !== 'opinion' && styles.bylineBackground,
                    appearance.backgrounds,
                    {
                        justifyContent: 'flex-end',
                        alignContent: 'stretch',
                        alignItems: 'stretch',
                    },
                ]}
            >
                <StandfirstText
                    style={[appearance.text, appearance.standfirst]}
                >
                    {standfirst}
                </StandfirstText>
            </View>
        </Animated.View>
    )
}

export { ArticleStandfirst }
