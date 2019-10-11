import React, { ReactNode, useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { Appearance } from 'src/common'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { LoginOverlay } from 'src/components/login/login-overlay'
import { ERR_404_MISSING_PROPS } from 'src/helpers/words'
import { getAppearancePillar } from 'src/hooks/use-article'
import { useDimensions } from 'src/hooks/use-screen'
import {
    ArticleNavigationProps,
    getArticleNavigationProps,
} from 'src/navigation/helpers/base'
import { ArticleNavigatorInjectedProps } from 'src/navigation/navigators/article'
import { routeNames } from 'src/navigation/routes'
import { PathToArticle } from 'src/paths'
import { sendPageViewEvent } from 'src/services/ophan'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { ArticleScreenBody } from './article/body'
import { ArticleSlider } from './article/slider'

export interface ArticleTransitionProps {
    startAtHeightFromFrontsItem: number
}

export interface ArticleNavigator {
    articles: PathToArticle[]
    appearance: Appearance
    frontName: string
}

const ArticleScreenLoginOverlay = ({
    navigation,
    children,
}: {
    navigation: NavigationScreenProp<{}, ArticleNavigationProps>
    children: ReactNode
}) => (
    <LoginOverlay
        isFocused={() => navigation.isFocused()}
        onLoginPress={() => navigation.navigate(routeNames.SignIn)}
        onOpenCASLogin={() => navigation.navigate(routeNames.CasSignIn)}
        onDismiss={() => navigation.goBack()}
    >
        {children}
    </LoginOverlay>
)

const styles = StyleSheet.create({
    refView: { flex: 1 },
})

const ArticleScreenWithProps = ({
    path,
    articleNavigator,
    onDismiss,
    navigation,
    prefersFullScreen,
}: Required<ArticleNavigationProps> &
    ArticleNavigatorInjectedProps & {
        navigation: NavigationScreenProp<{}, ArticleNavigationProps>
    }) => {
    const pillar = getAppearancePillar(articleNavigator.appearance)
    const firstUpdate = useRef(true)
    const viewRef = useRef<View>()
    const { width } = useDimensions()
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false
            return
        }
        if (viewRef.current) {
            viewRef.current.setNativeProps({ opacity: 0 })
            setTimeout(() => {
                viewRef.current &&
                    viewRef.current.setNativeProps({ opacity: 1 })
            }, 600)
        }
    }, [width])
    return (
        <ArticleScreenLoginOverlay navigation={navigation}>
            <View
                style={styles.refView}
                ref={r => {
                    if (r) viewRef.current = r
                }}
                removeClippedSubviews
            >
                {prefersFullScreen ? (
                    <ArticleScreenBody
                        path={path}
                        width={width}
                        pillar={pillar}
                        onTopPositionChange={() => {}}
                    />
                ) : (
                    <ArticleSlider
                        path={path}
                        articleNavigator={articleNavigator}
                        onDismiss={onDismiss}
                    />
                )}
            </View>
        </ArticleScreenLoginOverlay>
    )
}

export const ArticleScreen = ({
    navigation,
    onDismiss,
}: {
    navigation: NavigationScreenProp<{}, ArticleNavigationProps>
} & ArticleNavigatorInjectedProps) =>
    getArticleNavigationProps(navigation, {
        error: () => (
            <FlexErrorMessage
                title={ERR_404_MISSING_PROPS}
                style={{ backgroundColor: color.background }}
            />
        ),
        success: props => {
            if (props.path && props.path.article) {
                sendPageViewEvent({ path: props.path.article })
            }
            return (
                <ArticleScreenWithProps
                    {...{ navigation, onDismiss }}
                    {...props}
                />
            )
        },
    })

ArticleScreen.navigationOptions = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => ({
    title: navigation.getParam('title', 'Loading'),
    gesturesEnabled: true,
    gestureResponseDistance: {
        vertical: metrics.headerHeight + metrics.slideCardSpacing,
    },
})
