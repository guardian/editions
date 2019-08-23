import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { ariaHidden } from 'src/helpers/a11y'
import { useMediaQuery } from 'src/hooks/use-screen'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { MaxWidthWrap } from './max-width'
import { MultilineWrap } from './multiline-wrap'
import { Wrap } from './wrap'

const fillStyles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
        left: '-100%',
        right: 0,
        top: 0,
    },
})
const FillLeftSide = ({ backgroundColor }: { backgroundColor: string }) => (
    <View
        {...ariaHidden}
        style={[
            fillStyles.root,
            {
                backgroundColor,
            },
        ]}
    ></View>
)

const styles = StyleSheet.create({
    tabletRoot: {
        width: '100%',
        marginRight: 0,
    },
    tabletPad: {
        paddingRight: metrics.article.railPaddingLeft,
    },
    mobileRoot: {
        marginRight: metrics.sides.sides * 4,
    },
})

const LeftSideBleed = ({
    backgroundColor,
    children,
    topOffset,
}: {
    backgroundColor: string
    children: ReactNode
    topOffset: number
}) => {
    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)

    return isTablet ? (
        <MaxWidthWrap invert>
            <View
                style={[
                    styles.tabletRoot,
                    { backgroundColor, marginTop: (topOffset || 0) * -1 },
                ]}
            >
                <FillLeftSide backgroundColor={backgroundColor} />
                <View style={styles.tabletPad}>{children}</View>
            </View>
        </MaxWidthWrap>
    ) : (
        <View
            style={[
                styles.mobileRoot,
                {
                    backgroundColor,
                    marginTop: (topOffset || 0) * -1,
                },
            ]}
        >
            <FillLeftSide backgroundColor={backgroundColor} />
            {children}
        </View>
    )
}

export { LeftSideBleed }
