import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ArticleTheme } from 'src/components/article/html/article'
import { NativeArrow } from 'src/components/article/html/components/icon/native-arrow'
import { themeColors } from 'src/components/article/html/helpers/css'
import { Direction } from '../../../../Apps/common/src'
import { families } from 'src/theme/typography'

const styles = StyleSheet.create({
    captionWrapper: {
        fontFamily: families.text.regular,
        position: 'absolute',
        zIndex: 1,
        opacity: 0.8,
        backgroundColor: themeColors(ArticleTheme.Dark).background,
        bottom: 0,
        width: '100%',
    },
    captionText: {
        color: themeColors(ArticleTheme.Dark).dimText,
        paddingLeft: 2,
    },
    caption: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 5,
        paddingHorizontal: 10,
    },
    creditText: {
        color: themeColors(ArticleTheme.Dark).dimText,
        paddingLeft: 12,
        paddingBottom: 50,
    },
})

const LightboxCaption = ({
    caption,
    pillarColor,
    credit,
}: {
    caption: string
    pillarColor: string
    credit: string
}) => {
    return (
        <View style={styles.captionWrapper}>
            <View style={styles.caption}>
                <NativeArrow fill={pillarColor} direction={Direction.top} />
                <Text style={styles.captionText}>{caption}</Text>
            </View>
            <View style={styles.caption}>
                <Text style={styles.creditText}>{credit}</Text>
            </View>
        </View>
    )
}

export { LightboxCaption }
