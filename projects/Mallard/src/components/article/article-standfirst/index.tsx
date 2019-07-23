import React from 'react'
import { View, StyleSheet, Animated, StyleProp } from 'react-native'
import { StandfirstText } from '../../styled-text'
import { metrics } from 'src/theme/spacing'
import { useArticleAppearance } from 'src/theme/appearance'
import { animationStyles } from '../styles'

export interface PropTypes {
    standfirst: string
    byline: string
    style?: StyleProp<{}>
    navigationPosition?: any
}

const styles = StyleSheet.create({
    background: {
        alignItems: 'flex-start',
        marginHorizontal: metrics.horizontal,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingTop: metrics.vertical / 2,
    },
    bylineBackground: {
        marginTop: metrics.vertical,
        marginBottom: metrics.vertical,
        paddingTop: metrics.vertical / 4,
        width: '100%',
    },
})

const ArticleStandfirst = ({
    standfirst,
    byline,
    navigationPosition,
}: PropTypes) => {
    const { appearance } = useArticleAppearance()
    return (
        <Animated.View
            style={
                animationStyles(navigationPosition)
            }
        >
            <StandfirstText style={[appearance.text, appearance.standfirst]}>
                {standfirst}
            </StandfirstText>
            <View
                style={[
                    styles.bylineBackground,
                    appearance.backgrounds,
                    {
                        justifyContent: 'flex-end',
                        alignContent: 'stretch',
                        alignItems: 'stretch',
                    },
                ]}
            >
            </View>
        </Animated.View>
    )
}

export { ArticleStandfirst }
