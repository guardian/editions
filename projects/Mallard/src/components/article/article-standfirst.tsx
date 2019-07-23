import React from 'react'
import { View, StyleSheet, Animated, StyleProp } from 'react-native'
import { StandfirstText, BodyCopy } from '../styled-text'
import { metrics } from 'src/theme/spacing'
import { useArticleAppearance } from 'src/theme/appearance'
import { Multiline } from '../multiline'

export interface PropTypes {
    standfirst: string
    byline: string
    style?: StyleProp<{}>
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

const Standfirst = ({ standfirst, byline, style }: PropTypes) => {
    const { appearance, name } = useArticleAppearance()
    return (
        <Animated.View
            style={[styles.background, appearance.backgrounds, style]}
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
                <Multiline
                    count={name === 'opinion' ? 8 : 4}
                    color={
                        StyleSheet.flatten([appearance.text, appearance.byline])
                            .color
                    }
                />
                <BodyCopy
                    weight={'bold'}
                    style={[appearance.text, appearance.byline]}
                >
                    {byline}
                </BodyCopy>
            </View>
        </Animated.View>
    )
}

export { Standfirst }
