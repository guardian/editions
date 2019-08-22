import React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { HeadlineKickerText } from 'src/components/styled-text'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { useArticle } from 'src/hooks/use-article'
import { useMediaQuery } from 'src/hooks/use-screen'
import { Breakpoints } from 'src/theme/breakpoints'

const height = metrics.vertical * 4

const styles = StyleSheet.create({
    kicker: {
        color: color.palette.neutral[100],
        padding: metrics.article.sides,
        paddingVertical: metrics.vertical / 2,
        height,
        marginTop: metrics.vertical * -4,
        width: 'auto',
        textAlign: 'left',
        flexShrink: 1,
        fontFamily: getFont('headline', 1, 'bold').fontFamily,
    },
    kickerHolder: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
})

interface PropTypes {
    children: string
    style?: StyleProp<ViewStyle>
}

const TagKicker = ({ children, style }: PropTypes) => {
    const [articleColor] = useArticle()
    return (
        <View style={styles.kickerHolder}>
            <HeadlineKickerText
                style={[
                    styles.kicker,
                    style,
                    {
                        backgroundColor: articleColor.main,
                    },
                ]}
            >
                {children}
            </HeadlineKickerText>
        </View>
    )
}
TagKicker.height = height

const hangyKickerStyles = StyleSheet.create({
    normal: {
        marginTop: -height,
    },
    mobile: {
        marginLeft: metrics.article.sides * -1,
    },
})
const HangyTagKicker = ({
    translate,
    ...props
}: PropTypes & { translate?: number }) => {
    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)
    return (
        <TagKicker
            {...props}
            style={[
                props.style,
                hangyKickerStyles.normal,
                !isTablet && hangyKickerStyles.mobile,
                translate
                    ? {
                          transform: [{ translateY: translate }],
                      }
                    : null,
            ]}
        />
    )
}

export { TagKicker, HangyTagKicker }
