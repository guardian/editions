import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ArticleImage } from '../article-image'
import { longReadHeaderStyles } from '../styles'
import { ArticleHeaderProps } from './types'
import { Multiline } from '../../multiline'
import { ArticleByline } from '../article-byline'
import {
    HeadlineText,
    HeadlineKickerText,
    StandfirstText,
} from 'src/components/styled-text'
import { color } from 'src/theme/color'

const LongReadHeader = ({
    byline,
    headline,
    image,
    kicker,
    standfirst,
}: ArticleHeaderProps) => {
    return (
        <View style={[longReadHeaderStyles.background]}>
            {image ? (
                <ArticleImage
                    style={StyleSheet.absoluteFillObject}
                    image={image}
                />
            ) : null}
            <View style={[longReadHeaderStyles.textBackground]}>
                {kicker ? (
                    <HeadlineKickerText
                        style={{ color: color.palette.neutral[100] }}
                    >
                        {kicker}
                    </HeadlineKickerText>
                ) : null}
                <HeadlineText>{headline}</HeadlineText>
            </View>
            <View style={[longReadHeaderStyles.textBackground]}>
                <StandfirstText style={{ color: color.palette.neutral[100] }}>
                    {standfirst}
                </StandfirstText>
                <Multiline count={4} color={color.palette.neutral[100]} />
                <ArticleByline style={{ color: color.palette.neutral[100] }}>
                    {byline}
                </ArticleByline>
            </View>
        </View>
    )
}

export { LongReadHeader }
