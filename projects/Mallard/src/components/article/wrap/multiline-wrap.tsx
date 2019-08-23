import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { Fader } from 'src/components/layout/animators/fader'
import { Multiline } from 'src/components/multiline'
import { ariaHidden } from 'src/helpers/a11y'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { Wrap, WrapperPropTypes } from './wrap'

const ArticleFader = Fader
const multiStyles = StyleSheet.create({
    byline: {
        paddingBottom: metrics.vertical,
        paddingTop: metrics.vertical / 6,
        minHeight: getFont('text', 1).lineHeight * 2.75,
    },
    paddingTop: {
        paddingTop: metrics.vertical,
    },
    bylineBorder: {
        borderBottomColor: color.dimLine,
        borderBottomWidth: 1,
    },
    topBorder: {
        height: StyleSheet.hairlineWidth,
        width: '100%',
        backgroundColor: color.line,
    },
})

const MultilineWrap = ({
    byline,
    needsTopPadding = false,
    multilineColor = color.line,
    ...props
}: Exclude<WrapperPropTypes, 'header' | 'style' | 'footer'> & {
    needsTopPadding?: boolean
    byline: ReactNode
    multilineColor?: string
}) => (
    <>
        {needsTopPadding && (
            <View {...ariaHidden} style={[multiStyles.topBorder]}></View>
        )}
        <Wrap {...props} style={[needsTopPadding && multiStyles.paddingTop]} />
        {byline && (
            <Wrap
                backgroundColor={props.backgroundColor}
                borderColor={props.borderColor}
                style={[multiStyles.byline]}
                header={
                    <ArticleFader>
                        <Multiline count={4} color={multilineColor} />
                    </ArticleFader>
                }
                footer={
                    !props.backgroundColor && (
                        <ArticleFader>
                            <View style={multiStyles.bylineBorder} />
                        </ArticleFader>
                    )
                }
            >
                <ArticleFader>{byline}</ArticleFader>
            </Wrap>
        )}
    </>
)

export { MultilineWrap }
