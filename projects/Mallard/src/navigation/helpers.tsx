import React from 'react'
import { NavigationScreenProp } from 'react-navigation'
import {
    ArticleNavigator,
    ArticleTransitionProps,
    PathToArticle,
} from 'src/screens/article-screen'

/**
 *
 * @param Component - component that doesn't want to have navigation as a dependency
 * @param mapper - function to generate props from navigation
 *
 * Much like `mapDispatchToProps` in `redux`. Means we can decouple out components from navigation.
 */
const mapNavigationToProps = <T extends {}, P extends {}>(
    Component: React.ComponentType<T>,
    mapper: (navigation: NavigationScreenProp<P>) => Partial<T>,
) => (props: T & { navigation: NavigationScreenProp<P> }) => (
    <Component {...props} {...mapper(props.navigation)} />
)

export interface ArticleNavigationProps {
    transitionProps?: ArticleTransitionProps
    path: PathToArticle
    articleNavigator?: ArticleNavigator
}
const navigateToArticle = (
    navigation: NavigationScreenProp<{}>,
    navigationProps: ArticleNavigationProps,
): void => {
    navigation.navigate('Article', navigationProps)
}

export { mapNavigationToProps, navigateToArticle }
