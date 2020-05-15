import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ArticleTheme } from 'src/components/article/html/article'
import { NativeArrow } from 'src/components/article/html/components/icon/native-arrow'
import { themeColors } from 'src/components/article/html/helpers/css'
import { Direction } from '../../../../Apps/common/src'
import { families } from 'src/theme/typography'
import HTMLView from 'react-native-htmlview'

const styles = StyleSheet.create({
    captionWrapper: {
        fontFamily: families.text.regular,
        fontSize: 14,
        position: 'absolute',
        zIndex: 1,
        opacity: 0.8,
        backgroundColor: themeColors(ArticleTheme.Dark).background,
        bottom: 0,
        width: '100%',
    },
    captionText: {
        color: themeColors(ArticleTheme.Dark).text,
        paddingLeft: 2,
        paddingBottom: 50,
    },
    caption: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 5,
        paddingHorizontal: 10,
    },
})

const captionStyleSheet = (pillarColor: string) => {
    return StyleSheet.create({
        caption: {
            fontFamily: families.sans.regular,
            color: themeColors(ArticleTheme.Dark).text,
        },
        b: {
            fontFamily: families.sans.bold,
            color: themeColors(ArticleTheme.Dark).text,
        },
        strong: {
            fontFamily: families.sans.bold,
            color: themeColors(ArticleTheme.Dark).text,
            paddingLeft: 12,
        },
        credit: {
            fontFamily: families.sans.regular,
            color: themeColors(ArticleTheme.Dark).text,
        },
        a: {
            color: pillarColor,
            textDecorationLine: 'underline',
            textDecorationColor: pillarColor,
        },
    })
}

const LightboxCaption = ({
    caption,
    pillarColor,
    credit,
}: {
    caption: string
    pillarColor: string
    credit: string
}) => {
    const captionStyles = captionStyleSheet(pillarColor)
    return (
        <View style={styles.captionWrapper}>
            <View style={styles.caption}>
                <NativeArrow fill={pillarColor} direction={Direction.top} />
                <View style={styles.captionText}>
                    <HTMLView
                        value={
                            '<caption>' +
                            caption +
                            '<br>' +
                            credit +
                            '</caption>'
                        }
                        stylesheet={captionStyles}
                    />
                </View>
            </View>
        </View>
    )
}

export { LightboxCaption }
