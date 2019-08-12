import React, { ReactNode } from 'react'
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { Breakpoints } from 'src/theme/breakpoints'
import { WithBreakpoints } from 'src/components/layout/ui/with-breakpoints'
import { ArticleMultiline } from '../article-multiline'
import { getFader } from 'src/components/layout/animators/fader'

export enum WrapLayout {
    narrow,
    tablet,
    tabletLandscape,
}

interface ChildPropTypes {
    children: ReactNode
    header?: ReactNode
    footer?: ReactNode
}

interface ContentWrapperPropTypes extends ChildPropTypes {
    style?: StyleProp<ViewStyle>
}

interface WrapperPropTypes extends ContentWrapperPropTypes {
    backgroundColor?: ViewStyle['backgroundColor']
    borderColor?: ViewStyle['borderColor']
}

const contentWrapStyles = StyleSheet.create({
    root: {
        maxWidth: metrics.article.maxWidthLandscape,
        width: '100%',
        paddingLeft: metrics.article.sides,
    },
    rootTablet: {
        paddingLeft: metrics.article.sidesTablet,
    },
    inner: {
        paddingRight: metrics.article.sides,
    },
    innerTablet: {
        paddingRight: metrics.article.sidesTablet * 1.25,
    },
})
const ContentWrapper = ({
    style,
    header,
    footer,
    children,
    tablet,
}: ContentWrapperPropTypes & { tablet?: boolean }) => (
    <View
        style={[
            style,
            contentWrapStyles.root,
            tablet && contentWrapStyles.rootTablet,
        ]}
    >
        {header}
        <View
            style={[
                contentWrapStyles.inner,
                tablet && contentWrapStyles.innerTablet,
            ]}
        >
            {children}
        </View>
        {footer}
    </View>
)

const tabletWrapStyles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    rightRail: {
        width: metrics.article.rightRail,
        flexShrink: 0,
        borderLeftWidth: 1,
    },
    rightRailLandscape: {
        width: metrics.article.rightRailLandscape,
    },
})
const TabletWrapper = ({
    backgroundColor,
    borderColor,
    landscape = false,
    ...innerProps
}: WrapperPropTypes & { landscape?: boolean }) => (
    <View style={tabletWrapStyles.root}>
        <View style={tabletWrapStyles.content}>
            <ContentWrapper tablet {...innerProps} />
        </View>
        <View
            style={[
                tabletWrapStyles.rightRail,
                { borderLeftColor: borderColor },
                landscape && tabletWrapStyles.rightRailLandscape,
            ]}
        ></View>
    </View>
)

const wrapStyles = StyleSheet.create({
    mobileSides: {
        paddingHorizontal: metrics.article.sides,
    },
})
const Wrap = ({
    children,
    backgroundColor,
    ...props
}: Exclude<WrapperPropTypes, 'landscape'>) => {
    return (
        <View style={{ backgroundColor }}>
            <WithBreakpoints>
                {{
                    0: () => <ContentWrapper {...{ children, ...props }} />,
                    [Breakpoints.tabletVertical]: () => (
                        <TabletWrapper
                            {...{ children, backgroundColor, ...props }}
                        />
                    ),
                    [Breakpoints.tabletLandscape]: () => (
                        <TabletWrapper
                            {...{ children, backgroundColor, ...props }}
                            landscape={true}
                        />
                    ),
                }}
            </WithBreakpoints>
        </View>
    )
}

const ArticleFader = getFader('article')
const multiStyles = StyleSheet.create({
    byline: {
        paddingBottom: metrics.vertical / 2,
    },
    paddingTop: {
        paddingTop: metrics.vertical,
    },
    bylineBorder: {
        borderBottomColor: color.dimLine,
        borderBottomWidth: 1,
    },
})

const MultilineWrap = ({
    byline,
    ...props
}: Exclude<WrapperPropTypes, 'header' | 'style' | 'footer'> & {
    byline: ReactNode
}) => (
    <>
        <Wrap
            style={[!!props.backgroundColor && multiStyles.paddingTop]}
            {...props}
        />
        {byline && (
            <Wrap
                backgroundColor={props.backgroundColor}
                borderColor={props.borderColor}
                style={[multiStyles.byline]}
                header={
                    <ArticleFader>
                        <ArticleMultiline />
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

export { Wrap, MultilineWrap }
