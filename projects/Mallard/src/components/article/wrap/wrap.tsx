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
    tablet?: boolean
    bleeds?: boolean
    wide?: boolean
    style?: StyleProp<
        Pick<ViewStyle, 'paddingVertical' | 'paddingTop' | 'paddingBottom'>
    >
}

interface TabletWrapperPropTypes
    extends Exclude<ContentWrapperPropTypes, 'tablet' | 'wide'> {
    backgroundColor?: ViewStyle['backgroundColor']
    borderColor?: ViewStyle['borderColor']
    rightRail?: ReactNode
    landscape?: boolean
}

interface WrapperPropTypes
    extends Exclude<TabletWrapperPropTypes, 'landscape'> {
    style?: StyleProp<
        Pick<ViewStyle, 'paddingVertical' | 'paddingTop' | 'paddingBottom'>
    >
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

const BleedyContentWrapper = ({
    header,
    footer,
    children,
}: Pick<ContentWrapperPropTypes, 'header' | 'footer' | 'children'>) => (
    <>
        {header}
        {footer}
        {children}
    </>
)

const ContentWrapper = ({
    tablet,
    style,
    bleeds,
    ...children
}: ContentWrapperPropTypes) => {
    if (bleeds) return <BleedyContentWrapper {...children} />
    return (
        <View
            style={[
                contentWrapStyles.root,
                tablet && contentWrapStyles.rootTablet,
            ]}
        >
            {children.header}
            <View
                style={[
                    style,
                    contentWrapStyles.inner,
                    tablet && contentWrapStyles.innerTablet,
                ]}
            >
                {children.children}
            </View>
            {children.footer}
        </View>
    )
}

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
    rightRailContent: {
        maxWidth: metrics.article.rightRail + metrics.article.sidesTablet * 1.5,
        paddingRight: metrics.article.sidesTablet * 1.5,
        paddingLeft: metrics.article.sidesTablet / 2,
        marginTop: metrics.vertical * -0.25,
    },
})
const TabletWrapper = ({
    borderColor,
    landscape = false,
    rightRail,
    ...innerProps
}: TabletWrapperPropTypes) => (
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
        >
            {rightRail && (
                <View
                    style={[
                        tabletWrapStyles.rightRailContent,
                        innerProps.style,
                    ]}
                >
                    {rightRail}
                </View>
            )}
        </View>
    </View>
)

const TabletWideVerticalWrapper = ({
    children,
    backgroundColor,
    ...props
}: WrapperPropTypes) => (
    <View style={props.style}>
        {props.bleeds ? (
            <BleedyContentWrapper header={props.header} footer={props.footer}>
                {children}
            </BleedyContentWrapper>
        ) : (
            <TabletWrapper
                {...{
                    children,
                    backgroundColor,
                    ...props,
                }}
                rightRail={null}
            />
        )}
        {props.rightRail && (
            <TabletWrapper
                backgroundColor={backgroundColor}
                borderColor={props.borderColor}
                rightRail={null}
            >
                {props.rightRail}
            </TabletWrapper>
        )}
    </View>
)

const Wrap = ({
    wide = false,
    backgroundColor,
    ...props
}: WrapperPropTypes) => {
    return (
        <View style={[{ backgroundColor }]}>
            <WithBreakpoints>
                {{
                    0: () => (
                        <View style={props.style}>
                            <ContentWrapper {...props} />
                            {props.rightRail && (
                                <ContentWrapper>
                                    {props.rightRail}
                                </ContentWrapper>
                            )}
                        </View>
                    ),

                    [Breakpoints.tabletVertical]: () =>
                        wide ? (
                            <TabletWideVerticalWrapper
                                {...{ backgroundColor, ...props }}
                            />
                        ) : (
                            <TabletWrapper
                                {...{
                                    backgroundColor,
                                    ...props,
                                }}
                            />
                        ),

                    [Breakpoints.tabletLandscape]: () => (
                        <TabletWrapper
                            {...{ backgroundColor, ...props }}
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
