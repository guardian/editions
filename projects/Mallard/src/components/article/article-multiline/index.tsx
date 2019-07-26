import React from 'react'
import { StyleSheet } from 'react-native'
import { Multiline } from 'src/components/multiline'
import { useArticleAppearance } from 'src/theme/appearance'

const ArticleMultiline = () => {
    const { appearance } = useArticleAppearance()
    return (
        <Multiline
            count={4}
            color={
                StyleSheet.flatten([appearance.text, appearance.byline]).color
            }
        />
    )
}

export { ArticleMultiline }
