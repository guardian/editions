import React from 'react'
import { View, StyleSheet } from 'react-native'
import { StandfirstText, BodyCopy } from '../styled-text'
import { metrics } from '../../theme/spacing'
import { useArticleAppearance } from '../../theme/appearance'
import { Multiline } from '../multiline'

export interface PropTypes {
    standfirst: string
    byline: string
}

const styles = StyleSheet.create({
    background: {
        alignItems: 'flex-start',
        paddingHorizontal: metrics.horizontal,
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

const Standfirst = ({ standfirst, byline }: PropTypes) => {
    const { appearance, name } = useArticleAppearance()
    return (
        <View style={[styles.background, appearance.backgrounds]}>
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
                    count={name === 'comment' ? 8 : 4}
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
        </View>
    )
}

export { Standfirst }
